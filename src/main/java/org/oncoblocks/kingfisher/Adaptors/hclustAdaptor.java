package org.oncoblocks.kingfisher.Adaptors;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by xiuchengquek on 13/06/15.
 */

/**
 * Simple Type Adaptor to convert Json to POJO using GSON.
 * 2 Fields : timePoint and vafMap
 */


public class hclustAdaptor {

    private ArrayList<String> timePoint;
    private Map<String, List<Double>> vafMap;

    hclustAdaptor() {}

    /**
     * Convert json arary of list to ArrayList
     * @return ArrayList of String containing names of timePoints
     */
    public ArrayList<String> getTimePoint() {
        return this.timePoint;
    }

    /**
     * Convert Json objects into list of double.
     * @return map containing mutation name as the key and the value is list of double
     */
    public Map<String, List<Double>> getVafMap() {
        return this.vafMap;
    }
}


















