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
     * Create Attribute object required for Weka Attributes for each time point
     *
     * @param timePoint ArrayList of time points.
     * @return attributes ArrayList of weka Attributes
     * @see <a href="http://weka.sourceforge.net/doc.dev/weka/core/Attribute.html">Weka Attributes</a>
     */
    public static ArrayList<Attribute> makeAttributes(ArrayList<String> timePoint) {

        ArrayList<Attribute> attributes = new ArrayList<>();
        for (String point : timePoint) {
            attributes.add(new Attribute(point));
        }
        attributes.add(new Attribute("Name", (List<String>) null));

        return attributes;
    }


    /**
     * @param vafMap Map containing vaf score for each mutatant
     * @param timePoint ArrayList of time point
     * @return String of hiercherical clustering in the form of a newick string
     * @throws Exception
     */

    public static String doClust(Map<String, List<Double>> vafMap,
                                 ArrayList<String> timePoint) throws Exception {

        // run makeAttributes
        ArrayList<Attribute> attributes = makeAttributes(timePoint);

        // get no of attributes to make a Weka a data Instance. i.e The number of columns.
        Integer attributeSize = attributes.size();
        Instances data = new Instances("HClust", attributes, attributeSize);

        // For each element of the VafMap, construct a wekaRow
        for (Map.Entry<String, List<Double>> entry : vafMap.entrySet()) {

            // Get the name of the mutaton
            String key = entry.getKey();

            // Get the vaf score of the mutations as List of Double. Weka Require List of Double
            List<Double> vafValue = entry.getValue();

            // Initialize new  List of double with the correct size
            double[] wekaRow = new double[attributeSize];

            for (int i = 0; i < vafValue.size(); i++) {
                wekaRow[i] = vafValue.get(i);
            }

            /// Assign String value to the last element of the WekaRow List
            wekaRow[attributeSize - 1] = data.attribute(attributeSize - 1).addStringValue(key);

            // add data to data Instance.
            data.add(new DenseInstance(1.0, wekaRow));
        }

        // Initialize a HierachicalClusterer() and set Options
        HierarchicalClusterer hClust = new HierarchicalClusterer();
        // Complete Linkage
        hClust.setOptions(new String[]{"-L", "COMPLETE"});
        // Set 1 to get Single Hierarchary - Full Tree
        hClust.setNumClusters(1);
        // Use Euclidean Distance
        hClust.setDistanceFunction(new EuclideanDistance());
        hClust.setDistanceIsBranchLength(true);

        // Build Clusterer
        hClust.buildClusterer(data);

        // Return the Graph
        return hClust.graph();

    }


}
