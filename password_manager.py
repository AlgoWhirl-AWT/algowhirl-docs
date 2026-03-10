#!/usr/bin/env python3
"""
密码管理器 - 使用 AES-256-GCM 加密
"""
import os
import base64
import json
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# 密钥文件（请妥善保管，丢失后无法解密）
KEY_FILE = "/root/.keys/desktop_keys.key"

def get_or_create_key():
    """获取或生成加密密钥"""
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, 'rb') as f:
            return f.read()
    else:
        # 生成 256 位密钥
        key = os.urandom(32)
        os.makedirs(os.path.dirname(KEY_FILE), exist_ok=True)
        with open(KEY_FILE, 'wb') as f:
            f.write(key)
        os.chmod(KEY_FILE, 0o600)
        return key

def encrypt(data: str) -> str:
    """加密数据"""
    key = get_or_create_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    # nonce + ciphertext 一起 base64 编码
    return base64.b64encode(nonce + ciphertext).decode()

def decrypt(encrypted: str) -> str:
    """解密数据"""
    key = get_or_create_key()
    aesgcm = AESGCM(key)
    data = base64.b64decode(encrypted)
    nonce, ciphertext = data[:12], data[12:]
    return aesgcm.decrypt(nonce, ciphertext, None).decode()

def add_password(service: str, username: str, password: str, note: str = ""):
    """添加密码"""
    data = {
        "service": service,
        "username": username,
        "password": encrypt(password),  # 加密存储
        "note": note
    }
    
    # 追加到密码库
    db_path = "/root/.passwords/store.enc"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    existing = []
    if os.path.exists(db_path):
        with open(db_path, 'r') as f:
            existing = json.load(f)
    
    # 检查是否已存在
    for i, item in enumerate(existing):
        if item['service'] == service:
            existing[i] = data
            break
    else:
        existing.append(data)
    
    with open(db_path, 'w') as f:
        json.dump(existing, f, indent=2)
    print(f"✅ 已添加/更新: {service}")

def list_passwords():
    """列出所有服务（密码加密不可见）"""
    db_path = "/root/.passwords/store.enc"
    if not os.path.exists(db_path):
        print("暂无密码记录")
        return
    
    with open(db_path, 'r') as f:
        data = json.load(f)
    
    print("\n📁 密码库:")
    print("-" * 50)
    for item in data:
        print(f"服务: {item['service']}")
        print(f"  用户名: {item['username']}")
        print(f"  密码: ******** (已加密)")
        if item.get('note'):
            print(f"  备注: {item['note']}")
        print("-" * 50)

def get_password(service: str):
    """获取明文密码"""
    db_path = "/root/.passwords/store.enc"
    if not os.path.exists(db_path):
        return None
    
    with open(db_path, 'r') as f:
        data = json.load(f)
    
    for item in data:
        if item['service'] == service:
            return decrypt(item['password'])
    return None

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("用法:")
        print("  python3 password_manager.py add <服务> <用户名> <密码> [备注]")
        print("  python3 password_manager.py list")
        print("  python3 password_manager.py get <服务>")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "add":
        service = sys.argv[2]
        username = sys.argv[3]
        password = sys.argv[4]
        note = sys.argv[5] if len(sys.argv) > 5 else ""
        add_password(service, username, password, note)
    elif cmd == "list":
        list_passwords()
    elif cmd == "get":
        service = sys.argv[2]
        pwd = get_password(service)
        if pwd:
            print(f"{service}: {pwd}")
        else:
            print(f"未找到: {service}")
    else:
        print(f"未知命令: {cmd}")