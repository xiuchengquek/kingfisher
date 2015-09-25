# KingFisher

Tumor Heterogeneity Analysis and Visualization Tool

## Updates

-02/06/2015 : Establish basic framework for testing. Provided basic documentation. Working landing page.
-15/06/2015 : Added Hiercherical Clustering Service at the server backend. Added Service to store data at the from end
`dataFactory`.
-16/06/2015 : Added Parser for Maf and Clinical Data
-19/06/2015 : Boxplot, line plot and phylogenetic tree. Example dataset.
-25/09/2015 : Working boxplot, fishbone, hiercherical clustering plot and prelimiary fishplot


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

KingFisher uses JUnit and Karam/Jasmine for testing.

### To test kingfisher -  do the following

`mvn test` - Test Backend

### To Run Karma for frontend testing

`karma start` There are currently 28 specs and 9 known failures

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
GET | /hclust| 200 | Do hiercherical clustering |newick format representing hiercherical clustering results

## Componenets of KingFisherApp

In short the kingfisher app can be catogrised in 5 main plots

- Lineplot
    - Generated using google chart
    - Shows changes of mutation over time
- Boxplot
    - Generated using custom d3 code
    - Shows the distribution of variant allelic frequency score for each mutation
- Phylogenetic Tree
    - Generated using custom d3 code
    - show how the mutation clusters according to their variaamt allelic frequency score
- Fishbone
    - Generated using custom d3 code
    - representation of the clonal evolution based on clustering and varaint allelic frequency score
    - mutations belonging to the same clusters are represented by a single node
    - parent, child and sibling relationship are infered from the changes of variant allelic frequency score over time of each clusters
    ( see technical challenges below for more info)
- Fish Plot
    - Generated using custome d3 code


## Technical Challenges

One of the main challenge in the king fisher app was to infer the parent, child and sibling relationship betweeen the different clusters of mutations.

Biologically, different group of mutations can developed and evolve over time; Cancer cell are able to aquire more mutations on top of their exisiting mutations.

A parent-child relationship is established when a set of mutations occurs at a early stages of the cancer evolution (parents) give rise clones with addition set of mutations (child)

A sibling relationship occurs when 2 set of mutations arise from the same parents , but exhibits different patterns in changes of the variant allelic frequency

The challenge here is to identify these relationship based on the numeric value of allelic frequency and how they changes over time.

To do so we did a pairwise comparision the variant allelic frequency of mutations of each mutations with one another.

A node is considered a child to a parent node when the variant allelic frequency of the child node is smaller than that of its parent for all time point.

Sibling relationship occurs when 2 nodes do not posses a child-parent relationship.

Finally we have to do find construct the evolution track ( fish bone) using a link array and tree recursion.











