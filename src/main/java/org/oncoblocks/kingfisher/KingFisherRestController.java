/**
 * Created by xiuchengquek on 26/05/15.
 */

package org.oncoblocks.kingfisher;

import com.google.gson.Gson;
import org.oncoblocks.kingfisher.Adaptors.hclustAdaptor;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.JsonParser;
import com.google.gson.JsonArray;


import org.apache.commons.math3.ml.clustering.Cluster;



import java.util.List;

/**
 *  Controller for handling rest request based on interface declare in
 *  KingFisherRepository and based on KingFisherModel in KingFisherModel
 */
@RestController
public class KingFisherRestController {

    /** Autowire configuration based on interface declare in KingFisherRepository
     * @see KingFisherRepository
     * **/
    @Autowired
    private KingFisherRepository repo;

    /**
     * Method to andle GET request, return all items in the database
     * @return All KingFisherModel Objects in the database **/
    @RequestMapping(value="/rest" , method= RequestMethod.GET)
    public Iterable<KingFisherModel> getAll() {
        return repo.findAll();
    }

    /** Handle GET request, return all items with matching title in the database
     * @return List of KingFisherModel Objects with matching title **/
    @RequestMapping(value="/rest" , params={"title"}, method = RequestMethod.GET)
    List<KingFisherModel> findByTitle(@RequestParam("title") String title) {
        return repo.findByTitle(title);
    }

    /**
     * Handle POST request, add new entry base on KingFisherModel.
     * Returns the same item that was posted.
     * @return Response with Kingfisher model and HTTP status == 200
     */
    @RequestMapping(value="/rest", method=RequestMethod.POST)
    ResponseEntity<KingFisherModel> create(@RequestBody KingFisherModel kingFisherModel) {
        if (kingFisherModel != null) {
            repo.save(kingFisherModel);
        }
        return new ResponseEntity<>(kingFisherModel, HttpStatus.OK);

    }

    @RequestMapping(value="/hclust", method=RequestMethod.GET)
    ResponseEntity<String> doHClust(@RequestBody String data) throws Exception {

        Gson gson = new Gson();

        hclustAdaptor hclust = gson.fromJson(data, hclustAdaptor.class);

        HttpStatus returnCode = HttpStatus.OK;

        String hclustResults = "HClust did not succeed";

        if (hclust == null){
            returnCode = HttpStatus.NOT_ACCEPTABLE;
        }
        else {
            hclustResults =  KingFisherHClust.doClust(hclust.getVafMap(), hclust.getTimePoint());
        }

        return new ResponseEntity<>(hclustResults, HttpStatus.OK);




    }

}
