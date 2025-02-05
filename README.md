# PHP Auto Switcher

PHP Auto Switcher is a Visual Studio Code extension that automatically switches PHP versions inside the XAMPP folder or other specified based on the requirements specified in the `composer.json` file of your project.

> **Note:** This extension is for **WINDOWS ONLY**.

<img src="https://upload.wikimedia.org/wikipedia/pt/e/e0/Windows_logo.png?20150829231053" alt="Windows Logo" width="50" height="50">

## Contributing

We welcome contributions to the PHP Auto Switcher project! If you have suggestions for improvements or have found a bug, please open an issue or submit a pull request on our [GitHub repository](https://github.com/your-repo/php-auto-switcher).

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

### How to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

Thank you for your contributions!

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/igorponce/php-auto-switcher/blob/main/LICENSE) file for details.

## Release Notes

### 0.0.1

- Initial release of PHP Auto Switcher.

---