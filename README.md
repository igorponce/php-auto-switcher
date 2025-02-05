# PHP Auto Switcher

PHP Auto Switcher is a Visual Studio Code extension that automatically switches PHP versions inside the XAMPP folder or other specified based on the requirements specified in the `composer.json` file of your project.

## Features

- Automatically detects the required PHP version from `composer.json`.
- Switches the PHP version in the XAMPP folder to match the required version.
- Provides feedback through VS Code notifications.

## Requirements

- PHP installed on your system.
- Multiple PHP versions available in the XAMPP folder or any other folder specified in extension configuration, named as `php_X_Y` (e.g., `php_7_4`, `php_8_0`).

## Extension Settings

This extension contributes the following settings:

- `phpAutoSwitcher.phpFolderPath`: Path to the folder containing PHP versions (default: `C:\\xampp`).

## Known Issues

- The extension assumes that PHP versions are named in the format `php_X_Y` inside the XAMPP folder.
- The extension currently only supports switching PHP versions for Windows.

## Release Notes

### 0.0.1

- Initial release of PHP Auto Switcher.

---