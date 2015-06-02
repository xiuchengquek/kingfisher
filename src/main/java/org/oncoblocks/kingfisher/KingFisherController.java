/**
 * Created by xiuchengquek on 24/05/15.
 */

package org.oncoblocks.kingfisher;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/** main controller to serve url request ( non rest ) **/
@Controller
public class KingFisherController {

    /**
     * Maps request at "/index" to index.html
     *@return :  index
     */

    @RequestMapping(value="/", method = {RequestMethod.GET})
    public String index() {
        return "index";

    }

    /**
     * Maps request at "/prototype" to prototype.html
     * @return "prototype"
     */
    @RequestMapping(value="/prototype", method = {RequestMethod.GET})
    public String prototype() {
        return "prototype";

    }

}


