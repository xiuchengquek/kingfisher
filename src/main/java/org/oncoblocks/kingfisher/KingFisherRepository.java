package org.oncoblocks.kingfisher;

//import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


/**
 * Created by xiuchengquek on 26/05/15.
 */
//public interface KingFisherRepository extends MongoRepository<KingFisherModel, String>{

public interface KingFisherRepository extends CrudRepository<KingFisherModel, Long>{
    List<KingFisherModel> findByTitle(String title);

}
