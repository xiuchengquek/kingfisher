/**
 * Created by xiuchengquek on 28/05/15.
 */

package org.oncoblocks.kingfisher;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.UrlBasedViewResolver;


/**
 *  Configuration to override static files handler and internal view
 *  resolvers for serving static html pages
 */
@Configuration
public class KingFisherStaticConfig extends WebMvcConfigurerAdapter {


    /** Declare new resource location for static files **/
    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
            "classpath:/META-INF/resources/", "classpath:/resources/",
            "classpath:/static/", "classpath:/public/", "classpath:/templates"
           };

    /** Points to new resource location if request do not map to /webjars/ **/
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!registry.hasMappingForPattern("/webjars/**")) {
            registry.addResourceHandler("/webjars/**").addResourceLocations(
                    "classpath:/META-INF/resources/webjars/");
        }
        if (!registry.hasMappingForPattern("/**")) {
            registry.addResourceHandler("/**").addResourceLocations(
                    CLASSPATH_RESOURCE_LOCATIONS);
        }
    }

    /**
     * add configuration to serve html files when controllers return string
     * @return resolver that add "templates" as prefix and ".html" as suffix to strings returned
     * from controller
     *
     * **/
    @Bean
    public ViewResolver getViewResolver(){
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/templates/");
        resolver.setSuffix(".html");
        return resolver;
    }
}
