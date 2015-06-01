package org.oncoblocks.kingfisher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;


@SpringBootApplication
public class KingFisherApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application){
        return application.sources(KingFisherApplication.class);
    }
    public static void main(String[] args) {
        SpringApplication.run(KingFisherApplication.class, args);
    }
}
