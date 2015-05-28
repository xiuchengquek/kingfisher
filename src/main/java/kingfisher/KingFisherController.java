package kingfisher;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by xiuchengquek on 24/05/15.
 */
@Controller
public class KingFisherController {

    @RequestMapping(value="/", method = {RequestMethod.GET})
    public String index() {
        return "index";

    }

    @RequestMapping(value="/prototype", method = {RequestMethod.GET})
    public String prototype() {
        return "prototype";

    }

}


