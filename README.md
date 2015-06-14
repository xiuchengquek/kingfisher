# KingFisher

Tumor Heterogeneity Analysis and Visualization Tool

## Updates

-02/06/2015 : Establish basic framework for testing. Provided basic documentation. Working landing page.


## Introduction

OncoBlocks is a new open-source project, initiated by the Dana-Farber Cancer Institute and Memorial Sloan Kettering Cancer Center. The goal of the project is to create reusable, open source software components to support cancer genomics research and enable precision (or "personalized") cancer medicine.

Project KingFisher a component of Oncoblock and is web-based prototype for visualizing and analyzing multiple genomic snapshots over time and space.

## Dependencies

1. SQL Database - Currently KingFisher is running on MySQL. Other dialects of SQL might work but have not been tested yet.
2. Java -  KingFisher have only been tested on Java 8.
3. Maven - KingFisher have only been tested on maven3 ( 3.3.3 to be specific)

## Getting Started - Introduction

Kingfisher is a Java Spring-boot application currently configured to work with SQL databases. To configure your database settings please edit `application.properties` file found in `src/main/resources`.
For more information regarding configuration of the `application.properties` please refer to [guide](http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-placeholders-in-properties)
By default, kingfisher will use the following environment variable for your database settings.

1. `$sql_address` - address of your mysql server. for eg. `localhost/kfisher`
2. `$sql_user` -  username for connecting to your MySQL server e.g. `kingfisheruser`
3. `$sql_pass` - password used to access the MySQL.

## Building / Testing KingFisher

KingFisher uses JUnit and Jasmine for testing.

### To test kingfisher -  do the following

`mvn test` - There are a total of 4 tests and 2 Jasmine Specs.  Make sure your database is running

### To run Jasmine Test alone

`mvn jasmine:bdd` - This will launch server that binds to port 8234 on the localhost `localhost:8234`

### To build kingfisher

`mvn build` - This will generate a war file in `target/` . It should have the following filename: `kingfisherboot-X.X.X.RELEASE.war` where `X.X.X` refer to the version number of the application.

### To run Kingfisher

`mvn spring-boot:run` this will run kingfisher locally using the Spring boot maven [plugin](http://docs.spring.io/spring-boot/docs/current/maven-plugin/run-mojo.html)

### For Deployment

Pop your war file into your tomcat `webapp` directory

For more information about deploying applications. Please refer to [tomcat documentation](https://tomcat.apache.org/tomcat-7.0-doc/appdev/deployment.html) or have a look at cbioportal's [wiki page](https://github.com/cBioPortal/cbioportal/wiki)
 

## Route map

Verb | Path | Status | Response  | Description
-----|------|--------|-----------|-----
GET | /     | 200    | index.html | `src/main/resources/template/index.html`
GET | /prototype | 200 | prototype.html |  `src/main/resources/template/prototype.html`
GET | /rest | 200 | application/json | JSON object of all entries in database
POST| /rest | 200 |  xhr | Post data |
GET | /js/* | 200 | *.js | javascript libraries |







e










