/**
 * Created by xiuchengquek on 26/05/15.
 */
package org.oncoblocks.kingfisher;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;

/**
 * Simple Java Object that represent table KingFisherModel.
 * 5 columns - id, title, maf, cnv, clinical
 * title, maf, cnv and clincal represented as json string.
 */
@Entity
public class KingFisherModel implements Serializable{

    @Id
    @GeneratedValue
    private long id;

    private String title;
    private String maf;
    private String cnv;
    private String clinical;

    // constructor for populating entries
    protected KingFisherModel(){};
    public KingFisherModel(String title, String data, String cnv, String clinical) {
        this.title = title;
        this.maf = data;
        this.cnv = cnv;
        this.clinical = clinical;
    }

    // getter to get maf
    public String getMaf() {
        return maf;
    }

    // setter to set maf
    public void setMaf(String maf) {
        this.maf = maf;
    }

    // getter to get title.
    public String getTitle(){
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // getter to get cnv
    public String getCnv() { return cnv; }

    // getter to get clinical
    public String getClinical() { return clinical; }

    // getter to get id
    public Long getId() { return id;}

}
