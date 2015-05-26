package kingfisher;


//import org.springframework.data.mongodb.core.mapping.DBRef;
//import org.springframework.data.mongodb.core.mapping.Document;
//import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.*;


import java.io.Serializable;
import java.util.*;


/**
 * Created by xiuchengquek on 26/05/15.
 */
@Entity
public class KingFisherModel implements Serializable{



    @Id
    @GeneratedValue
    private long id;


    //private String id;

    private String title;

    private String data;

    // constructor for populating entries
    //public KingFisherModel() {};

    protected KingFisherModel(){};
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

    public Long getId() { return id;}

}
