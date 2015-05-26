package kingfisher;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.*;


/**
 * Created by xiuchengquek on 26/05/15.
 */
@Document
public class KingFisherModel {

    static final int MAX_LENGTH_DESCRIPTION = 500;
    static final int MAX_LENGTH_TITLE = 100;

    @Id
    private String id;

    private String title;

    private :wq data;

    // constructor for populating entries
    public KingFisherModel() {};

    public KingFisherModel(String title, String data) {
        this.title = title;
        this.data = data;
    }

    // getter to get data.
    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getTitle(){
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getId() { return id;}

}
