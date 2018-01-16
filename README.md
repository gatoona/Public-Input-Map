# Public Input Map Application Ver. 1.21.0

This map application was developed for and features the following:

  - SQLite and MySQL support to store and retrieve data.
  - Ability for users to draw and submit points and routes.
  - Back-end admin system to edit, add, and export data (geojson and kml).
  - Mailing system (PHPMailer)

# Requirements

The following applications were used for local testing.

| Application |Description |
| ------ | ------ |
| [MAMP](https://www.mamp.info/en/) | Used for local server and phpMyAdmin setup |
| [NodeJS](https://nodejs.org/en/) | For package mangement/install |
| [Ruby](https://rubyinstaller.org/) | For Compiling CSS |
| [MailCatcher](https://mailcatcher.me/) | For local mail testing |

# Windows Installation
Once you have setup MAMP and NodeJS:

```sh
$ cd C:\MAMP\htdocs\
$ git clone https://github.com/AltaPlanning/public-input-map.git
$ cd public-input-map
$ npm install
$ npm run develop
```
Once you have the application built, you will need to configure MAMP to serve the \dist folder in \public-input-map as the document root if you are setting this up in a local testing environment.
With that setup you should see the application running @ http://localhost

**IMPORTANT NOTE:** The admin section of this application (http://localhost/admin) is not password protected by default. If your testing environment is accessible to the public, ensure that the admin folder is protected. [Here's](http://www.htaccesstools.com/articles/password-protection/) an easy guide on setting that up.

### Other Commands

```sh
//Builds the application once:
$ npm run build
```

```sh
//Builds the application and watches for changes.
$ npm run develop
```

```sh
//Builds the application and zips the files for remote uploading
$ npm run zip
```

# Database Setup

The default structure of the database table is provided in [/src/db/data.sqlite](/src/db/data.sqlite)
If you need to setup the database for MySQL, set the database URL and credentials in [\src\config\config.php](/src/config/config.php) (line 8).

# Mailing Setup

You can configure the mailing system via the file: [\src\config\contact.php](\src\config\contact.php) file.
