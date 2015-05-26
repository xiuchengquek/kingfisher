package kingfisher;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


/**
 * Created by xiuchengquek on 26/05/15.
 */
public interface KingFisherRepository extends MongoRepository<KingFisherModel, String>{

    List<KingFisherModel> findByTitle(String title);

}
