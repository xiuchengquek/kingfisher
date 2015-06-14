package org.oncoblocks.kingfisher;

/**
 * Created by xiuchengquek on 12/06/15.
 */

import weka.clusterers.HierarchicalClusterer;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.EuclideanDistance;
import weka.core.Instances;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class KingFisherHClust {

    /**
     * Create Attribute object required for Weka for each time point
     * @param timePoint ArrayList of time points.
     * @return attributes Array List of attributes. Including a field called Gene
     */
    public static ArrayList<Attribute> makeAttributes(ArrayList<String> timePoint) {
        ArrayList<Attribute> attributes = new ArrayList<>();
        for(String point : timePoint){
            attributes.add(new Attribute(point));
        }
        attributes.add(new Attribute("Name", (List<String>) null));

        return attributes;
    }


    /**
     * 
     * @param vafMap Map containing vaf score for each mutatant
     * @param timePoint ArrayList of time point
     * @return String of hiercherical clustering in the form of a newick string
     * @throws Exception
     */

    public static String doClust (Map<String, List<Double>> vafMap,
                                   ArrayList<String> timePoint) throws Exception {


        ArrayList<Attribute> attributes = makeAttributes(timePoint);

        Integer attributeSize = attributes.size();
        Instances data = new Instances("HClust", attributes, attributeSize);


        for (Map.Entry<String, List<Double>> entry : vafMap.entrySet()){

            String key = entry.getKey();
            List<Double> vafValue= entry.getValue();
            double[] wekaRow = new double[attributeSize];


            for (int i = 0; i < vafValue.size(); i++){
                wekaRow[i] = vafValue.get(i);
            }

            wekaRow[attributeSize - 1] = data.attribute(attributeSize -1).addStringValue(key);

            data.add(new DenseInstance(1.0, wekaRow));
        }


        HierarchicalClusterer hClust = new HierarchicalClusterer();
        hClust.setOptions(new String[] {"-L", "COMPLETE"});
        hClust.setNumClusters(1);
        hClust.setDistanceFunction(new EuclideanDistance());
        hClust.setDistanceIsBranchLength(true);

        System.out.println(data);
        hClust.buildClusterer(data);
        System.out.println(hClust.graph());

        return hClust.graph();

    }













}
