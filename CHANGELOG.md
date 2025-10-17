# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- iPad 7th generation optimization with proper viewport settings
- PWA manifest with standalone mode support
- App icon for iPad home screen
- Touch-friendly interactions with 44px minimum touch targets
- Safe area insets handling for notch/home indicator
- Hardware-accelerated animations for smooth performance
- iPad-specific media queries for portrait and landscape orientations
- Enhanced Pomodoro module with full standard methodology
- Complete Pomodoro cycle: Work/Short Break/Long Break with auto-transitions
- Configurable timer durations for all Pomodoro phases
- Auto-start toggle and skip break functionality
- Visual cycle progress indicator (X/4 pomodoros)
- Phase-specific colors and improved UI

### Fixed
- Layout 3a and 3b now properly span full height
- Module control buttons properly sized and centered to avoid overlap
- Viewport height issues on iOS/iPadOS

## [0.1.0] - 2025-10-17

### Added
- Initial release of MACH (Modular Activity Control Hub)
- Aviation/aerospace-themed UI with cockpit design elements
- Four productivity modules: Pomodoro Timer, Task Manager, Dual Clock, Notes
- Four layout configurations: 2-module, 3-module (A/B variants), 4-module
- Module slot system with dynamic assignment
- Change/Remove module functionality with hover controls
- Layout selector option in Settings panel
- Settings panel for application configuration
- Author information in About section
- MIT License
- Comprehensive documentation (README, CHANGELOG, LICENSE)

### Removed
- ONLINE/OFFLINE status indicator
