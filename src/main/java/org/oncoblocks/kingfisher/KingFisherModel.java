package org.oncoblocks.kingfisher;


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

    private String maf;
    private String cnv;
    private String clinical;

    // constructor for populating entries
    //public KingFisherModel() {};

    protected KingFisherModel(){};
    public KingFisherModel(String title, String data, String cnv, String clinical) {
        this.title = title;
        this.maf = data;
        this.cnv = cnv;
        this.clinical = clinical;
    }

    // getter to get data.
    public String getMaf() {
        return maf;
    }

    public void setMaf(String maf) {
        this.maf = maf;
    }

    public String getTitle(){
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getCnv() { return cnv; }

    public String getClinical() { return clinical; }





    public Long getId() { return id;}

}
