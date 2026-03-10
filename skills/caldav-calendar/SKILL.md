---
name: caldav-calendar
description: Manage CalDAV calendars (iCloud, Google, Fastmail, Feishu/Lark, Nextcloud, etc.) via khal and vdirsyncer. View, list, and create events from the command line.
homepage: https://github.com/pimutils/khal
metadata: {"clawdbot":{"emoji":"📅","os":["linux","darwin"],"requires":{"bins":["khal","vdirsyncer"]},"install":[{"id":"pip","kind":"pip","packages":["khal","vdirsyncer"],"bins":["khal","vdirsyncer"],"label":"Install khal and vdirsyncer via pip"}]}}
---

# CalDAV Calendar Management (khal + vdirsyncer)

Manage CalDAV calendars using `khal` (CLI calendar) and `vdirsyncer` (CalDAV sync tool). Works with iCloud, Google Calendar, Fastmail, Feishu/Lark, Nextcloud, and other CalDAV-compatible services.

## Setup

### Installation

**Linux (pip)**:
```bash
pip3 install --user khal vdirsyncer importlib_metadata
```

**macOS (Homebrew)**:
```bash
brew install khal vdirsyncer
```

### Configuration

**1. Configure vdirsyncer** (`~/.config/vdirsyncer/config`):
```ini
[general]
status_path = "~/.local/share/vdirsyncer/status/"

[pair my_calendar]
a = "my_local"
b = "my_remote"
collections = ["from a", "from b"]
metadata = ["color", "displayname"]

[storage my_local]
type = "filesystem"
path = "~/.local/share/vdirsyncer/calendars/my_cal"
fileext = ".ics"

[storage my_remote]
type = "caldav"
url = "https://caldav.example.com/"
username = "your_username"
password = "your_password"
```

**2. Discover calendars**:
```bash
vdirsyncer discover my_calendar
```

**3. Configure khal** (`~/.config/khal/config`):
```ini
[calendars]

[[my_calendar]]
path = ~/.local/share/vdirsyncer/calendars/my_cal/CALENDAR_ID
color = light blue
priority = 40

[locale]
timeformat = %H:%M
dateformat = %Y-%m-%d
longdateformat = %Y-%m-%d
datetimeformat = %Y-%m-%d %H:%M
longdatetimeformat = %Y-%m-%d %H:%M

[default]
default_calendar = my_calendar
```

## Common Commands

### Sync Calendar
```bash
# Sync with CalDAV server (download + upload changes)
vdirsyncer sync

# Sync specific calendar pair
vdirsyncer sync my_calendar
```

### View Events
```bash
# List today's events
khal list

# List events for specific date
khal list tomorrow
khal list 2026-02-01
khal list next week

# Show calendar view (interactive)
khal calendar

# Show events in date range
khal list 2026-02-01 2026-02-28
```

### Create Events
```bash
# Quick add (tomorrow at 10:00, 1 hour duration)
khal new tomorrow 10:00 1h "Team meeting"

# With specific date
khal new 2026-02-15 14:00 2h "Quarterly planning"

# All-day event
khal new 2026-03-01 "Project deadline"

# After creating, sync to server
vdirsyncer sync
```

### Interactive Calendar
```bash
# Launch interactive TUI
ikhal
```

### Search Events
```bash
# Search by keyword
khal search "meeting"

# Search in date range
khal search --start 2026-02-01 --end 2026-02-28 "project"
```

## Environment Variables

Recommended to set in `~/.bashrc` or `~/.profile`:
```bash
export CALDAV_SERVER="https://caldav.example.com"
export CALDAV_USERNAME="your_username"
export CALDAV_PASSWORD="your_password"
export CALDAV_CALENDAR_ID="your-calendar-id"

# Convenient aliases
alias cal-sync='vdirsyncer sync'
alias cal-list='khal list'
alias cal-today='khal calendar'
alias cal-add='khal new'
```

## Example: Feishu/Lark Calendar

Configuration for Feishu (飞书/Lark) CalDAV:

**vdirsyncer config** (`~/.config/vdirsyncer/config`):
```ini
[general]
status_path = "~/.local/share/vdirsyncer/status/"

[pair feishu_calendar]
a = "feishu_local"
b = "feishu_remote"
collections = ["from a", "from b"]
metadata = ["color", "displayname"]

[storage feishu_local]
type = "filesystem"
path = "~/.local/share/vdirsyncer/calendars/feishu"
fileext = ".ics"

[storage feishu_remote]
type = "caldav"
url = "https://caldav.feishu.cn/"
username = "your_feishu_username"
password = "your_feishu_password"
```

**Environment variables**:
```bash
export CALDAV_SERVER="https://caldav.feishu.cn"
export CALDAV_USERNAME="u_xxxxxx"
export CALDAV_PASSWORD="your_password"
```

## Output Formats

**Default output** (human-readable):
```bash
khal list
# Today, 2026-01-28
# 13:00-13:30 午餐会 :: 视频会议: https://example.com
```

**Calendar view**:
```bash
khal calendar
# Shows month view with events
```

## Known Limitations

- **khal**: Does not support editing event timezones
- **Feishu/Lark**: Some CalDAV servers (like Feishu) may have compatibility issues with certain vdirsyncer operations
  - Workaround: Create events in the native app, then sync to local with `vdirsyncer sync`
- **Windows**: Not officially supported (use WSL or Linux VM)

## Supported Features

- ✅ List and view events
- ✅ Create new events
- ✅ Edit events
- ✅ Delete events
- ✅ Recurring events (RRULE)
- ✅ Event reminders (VALARM)
- ✅ Multiple calendars
- ✅ Search and filtering
- ✅ Time zone support
- ✅ iCalendar import/export
- ⚠️ Timezone editing (limited)

## Troubleshooting

**Commands not found**:
```bash
# Ensure ~/.local/bin is in PATH
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc
```

**Sync errors**:
```bash
# Debug mode
vdirsyncer -vdebug sync

# Re-discover calendars
vdirsyncer discover my_calendar
```

**Permission issues**:
```bash
# Check config permissions
chmod 600 ~/.config/vdirsyncer/config
chmod 600 ~/.config/khal/config
```

## Resources

- khal documentation: https://khal.readthedocs.io/
- vdirsyncer documentation: https://vdirsyncer.pimutils.org/
- CalDAV specification: https://tools.ietf.org/html/rfc4791

## Notes

- vdirsyncer handles bidirectional sync between local storage and CalDAV servers
- khal reads/writes to local vdir-format calendars
- Run `vdirsyncer sync` regularly (or set up a cron job) to keep calendars up-to-date
- For server-specific quirks, consult the vdirsyncer documentation or provider's CalDAV docs
