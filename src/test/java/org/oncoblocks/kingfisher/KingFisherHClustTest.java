/**
 * Created by xiuchengquek on 13/06/15.
 */

package org.oncoblocks.kingfisher;

import org.oncoblocks.kingfisher.Adaptors.hclustAdaptor;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.CoreMatchers.containsString;

import com.google.gson.Gson;
import weka.core.Attribute;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Unit test for Hiercherical Clustering
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = KingFisherApplication.class)
@WebAppConfiguration
public class KingFisherHClustTest {

    Map<String, List<Double>> mockVafMap = new HashMap<>();
    ArrayList<String> mockTimePoint;
    ArrayList<Attribute> mockAttributes;
    String mockNewick;
    Gson gson;
    String mockJson;

    @Autowired
    KingFisherRestController kingRestController;

    @Autowired
    WebApplicationContext wac;


    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {

        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        mockVafMap.put("SRSF2_p.P95H", Arrays.asList(0.5, 0.68, 0.62));
        mockVafMap.put("RUNX1_p.R174*", Arrays.asList(0.49, 0.482, 0.49));
        mockVafMap.put("ASXL1_p.Q760*", Arrays.asList(0.44, 0.48, 0.49));
        mockVafMap.put("RUNX1_p.K83*", Arrays.asList(0.38, 0.22, 0.07));
        mockVafMap.put("IDH2_p.R140Q", Arrays.asList(0.37, 0.16, 0.07));
        mockVafMap.put("SETBP1_p.D868N", Arrays.asList(0.1, 0.24, 0.32));

        mockTimePoint = new ArrayList<>();
        mockTimePoint.add("Pretreatment");
        mockTimePoint.add("C4D1");
        mockTimePoint.add("C7D1");

        mockAttributes = new ArrayList<Attribute>();
        mockAttributes.add(new Attribute("Pretreatment"));
        mockAttributes.add(new Attribute("C4D1"));
        mockAttributes.add(new Attribute("C7D1"));

        mockAttributes.add(new Attribute("Name", (List<String>) null));

        mockJson = "{ timePoint :[ \"Pretreatment\",\"C4D1\",\"C7D1\"], " +
                "vafMap : { SRSF2_p.P95H : [0.5,0.68,0.62], " +
                "RUNX1_p.R174* :[0.49, 0.482, 0.49]," +
                "ASXL1_p.Q760* :[0.44,0.48,0.49], " +
                "RUNX1_p.K83* : [0.38,0.22,0.07]," +
                "IDH2_p.R140Q : [0.37,0.16,0.07] , " +
                "SETBP1_p.D868N :[0.1,0.24,0.32]}" +
                "}";

        mockNewick ="Newick:((SRSF2_p.P95H:0.47571," +
                "(RUNX1_p.R174*:0.12506,ASXL1_p.Q760*:0.12506):0.47571):1.45108," +
                "((RUNX1_p.K83*:0.11806,IDH2_p.R140Q:0.11806):0.83552,SETBP1_p.D868N:0.83552):1.45108)";





    }

    @Test
    public void testKingFisherHClustMakeAttributes() throws Exception{
        ArrayList<Attribute> result = KingFisherHClust.makeAttributes(mockTimePoint);
        assertEquals(mockAttributes.size(), result.size());
        assertEquals(4, result.size());

        for (int i = 0; i < mockAttributes.size(); i++) {
            assertEquals(mockAttributes.get(i), result.get(i));
        }

        String results = KingFisherHClust.doClust(mockVafMap, mockTimePoint);
        assertThat(results, containsString("SRSF2_p.P95H:0.47571"));
    }


    @Test
    public void testKingFisherHClustAdaptor() throws Exception{

        gson = new Gson();
        hclustAdaptor hclust = gson.fromJson(mockJson, hclustAdaptor.class);

        assertEquals(mockTimePoint, hclust.getTimePoint());
        assertEquals(mockVafMap, hclust.getVafMap());

        String results = KingFisherHClust.doClust(hclust.getVafMap(), hclust.getTimePoint());
        assertThat(results, containsString("SRSF2_p.P95H:0.47571"));

    }

    @Test
    public void testControllerDoHClust() throws Exception{
        MvcResult results = mockMvc.perform(get("/hclust")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mockJson))
                .andExpect(status().isOk())
                .andReturn();

        String content = results.getResponse().getContentAsString();
        assertThat(content, containsString("SRSF2_p.P95H:0.47571"));
    }

    @Test
    public void testControllerDoHCLustFail() throws Exception{
        MvcResult results = mockMvc.perform(get("/hclust")
                .contentType(MediaType.APPLICATION_JSON)
                .content("FAIL"))
                .andExpect(status().isNotAcceptable())
                .andReturn();

        String content = results.getResponse().getContentAsString();
        assertThat(content, containsString("Malformed Data Structure. Please Check Data"));

        results = mockMvc.perform(get("/hclust")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ timePoint :[\"a\"], vafMap : {a : [0.1,0.2,0.33]}}"))
                .andExpect(status().isNotAcceptable())
                .andReturn();

        content = results.getResponse().getContentAsString();
        assertThat(content, containsString("Cluster Failed. Please Check Data"));
    }
}
