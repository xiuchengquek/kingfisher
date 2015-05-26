package kingfisher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.RequestEntity;


import java.util.*;
/**
 * Created by xiuchengquek on 26/05/15.
 */



@RestController
@RequestMapping("/rest")
public class KingFisherRestController {

    @Autowired
    private KingFisherRepository repo;

    @RequestMapping(method= RequestMethod.GET)
    public List<KingFisherModel> getAll() {
        return repo.findAll();
    }

    @RequestMapping(params={"title"}, method = RequestMethod.GET)
    List<KingFisherModel> findByTitle(@Param("title") String title) {
        return repo.findByTitle(title);
    }

    @RequestMapping(method=RequestMethod.POST)
    ResponseEntity<KingFisherModel> create(@RequestBody KingFisherModel kingFisherModel) {
        if (kingFisherModel != null) {
            repo.save(kingFisherModel);
        }
        return new ResponseEntity(kingFisherModel, HttpStatus.OK);

    }

}
