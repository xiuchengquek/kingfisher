/**
 * Created by xiuchengquek on 26/05/15.
 */

package org.oncoblocks.kingfisher;

//import org.springframework.data.mongodb.repository.MongoRepository;
import org.oncoblocks.kingfisher.Model.KingFisherModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


/** interface to perform Crud Operation, include a findByTitle Method **/
public interface KingFisherRepository extends CrudRepository<KingFisherModel, Long>{
    /** Find list based on title, return a list **/
    List<KingFisherModel> findByTitle(String title);
}
