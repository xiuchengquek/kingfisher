/**
 * Created by xiuchengquek on 26/05/15.
 */

package org.oncoblocks.kingfisher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

/**
 *  Controller for handling rest request based on interface declare in
 *  KingFisherRepository and based on KingFisherModel in KingFisherModel
 */
@RestController
@RequestMapping("/rest")
public class KingFisherRestController {

    /** Autowire configuration based on interface declare in KingFisherRepository **/
    @Autowired
    private KingFisherRepository repo;

    /** Handle GET request, return all items in the database **/
    @RequestMapping(method= RequestMethod.GET)
    public Iterable<KingFisherModel> getAll() {
        return repo.findAll();
    }

    /** Handle GET request, return all items with matching title in the database **/
    @RequestMapping(params={"title"}, method = RequestMethod.GET)
    List<KingFisherModel> findByTitle(@Param("title") String title) {
        return repo.findByTitle(title);
    }

    /** Handle POST request, add new entry base on KingFisherModel.
     * Returns the same item that was posted.
     */
    @RequestMapping(method=RequestMethod.POST)
    ResponseEntity<KingFisherModel> create(@RequestBody KingFisherModel kingFisherModel) {
        if (kingFisherModel != null) {
            repo.save(kingFisherModel);
        }
        return new ResponseEntity(kingFisherModel, HttpStatus.OK);

    }

}
