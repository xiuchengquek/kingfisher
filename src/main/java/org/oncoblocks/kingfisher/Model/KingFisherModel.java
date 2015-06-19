/**
 * Created by xiuchengquek on 26/05/15.
 */
package org.oncoblocks.kingfisher.Model;

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

    protected KingFisherModel(){};

    /**
     * constructor for populating entries
     * data, cnv, clincal are json string
     * title are user defined
     * @param title Title of data Stinrg
     * @param data Json string contain MAF
     * @param cnv Json String Contain CNV data
     * @param clinical Json String contain clinical data
     */


    public KingFisherModel(String title, String data, String cnv, String clinical) {
        this.title = title;
        this.maf = data;
        this.cnv = cnv;
        this.clinical = clinical;
    }

    /** Returns maf **/
    public String getMaf() {
        return maf;
    }

    /** Set maf value **/
    public void setMaf(String maf) {
        this.maf = maf;
    }

    /** Returns title **/
    public String getTitle(){
        return title;
    }

    /** Set title value **/
    public void setTitle(String title) {
        this.title = title;
    }

    /** Returns CNV value **/
    public String getCnv() { return cnv; }

    /** Returns Clinical Data **/
    public String getClinical() { return clinical; }

    /** Returns ID **/
    public Long getId() { return id;}

}
