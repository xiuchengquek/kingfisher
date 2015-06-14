package org.oncoblocks.kingfisher;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.Assert.assertEquals;

import com.google.gson.reflect.TypeToken;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import com.google.gson.*;
import org.oncoblocks.kingfisher.KingFisherApplication;
import org.oncoblocks.kingfisher.KingFisherModel;
import org.oncoblocks.kingfisher.KingFisherRepository;
import org.oncoblocks.kingfisher.KingFisherRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;


/**
 * Testsuite that ensure GET / POST request to the KingFisherController
 * and KingFisherRest handled accordingly
 * @see KingFisherRestController
 * @see org.oncoblocks.kingfisher.KingFisherController
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = KingFisherApplication.class)
@WebAppConfiguration
public class KingFisherControllerTest {

	@Autowired
    KingFisherRestController kingRestController;

	@Autowired
    KingFisherRepository repo;

    // Initialize 2 test object
	KingFisherModel test;
	KingFisherModel test2;

	private MockMvc mockMvc;

    // Gson for building json object
    Gson gson = new GsonBuilder().create();


    /**
     * Set up mock data in database
     * @throws Exception
     */
    @Before
	public void setUp() throws Exception {

		// delete all previous entry before test
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
		repo.deleteAll();

        // create new Kingfishermodel with the following String
		test = new KingFisherModel("test" , "maf", "cnv", "clinical");
		test2 = new KingFisherModel("test2" , "maf2", "cnv2", "clinical2");

        // save object to database
		repo.save(test);
		repo.save(test2);

	}

    // load application context
	@Autowired
	WebApplicationContext wac;

    /**
     * Test Case 0 : Check url work landing page and prototype page works
     * @throws Exception
     */
    @Test
    public void testGet() throws Exception{

        mockMvc.perform(get("/"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/prototype"))
                .andExpect(status().isOk());

    }

    /**
     *  Test Case 1 : Testing Get method from the rest api
     * @throws Exception
     */
	@Test
	public void testRestGet() throws Exception{

        List<KingFisherModel> expectedList =  Arrays.asList(test, test2);
        String expectedListString = gson.toJson(expectedList);

		mockMvc.perform(get("/rest"))
				.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON+ ";charset=UTF-8"))
                .andExpect(content().string(expectedListString));


        // Test to check that filter works.
        Type listType = new TypeToken<ArrayList<KingFisherModel>>() {}.getType();

        MvcResult results = mockMvc.perform(get("/rest?title=test"))
				.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8"))
                .andReturn();

        String content = results.getResponse().getContentAsString();
        List<KingFisherModel> kingFisherModelList = gson.fromJson(content, listType);

        assertEquals(test.getMaf(), kingFisherModelList.get(0).getMaf());

	}
    /**
     * Test Case 2 : Check that post works
     **/
    @Test
    public void testRestPost() throws Exception {

        // Create mock post json object using HashMap and serializing it to Json using GSON
        Map<String, String> testParameters = new HashMap<>();

        testParameters.put("title", "test3");
        testParameters.put("maf", "maf3");
        testParameters.put("cnv", "cnv3");
        testParameters.put("clinical", "clinical3");

        String testJson = gson.toJson(testParameters);

        // Perfom Post
        MvcResult results = mockMvc.perform(post("/rest")
               .contentType(MediaType.APPLICATION_JSON)
               .content(testJson))
               .andExpect(status().isOk())
                .andReturn();

        // Read Response from post request
        String content = results.getResponse().getContentAsString();
        KingFisherModel kingFisherModel = gson.fromJson(content, KingFisherModel.class);

        // Assert that the value are the same
        assertEquals("test3", kingFisherModel.getTitle());
        assertEquals("maf3", kingFisherModel.getMaf());
        assertEquals("cnv3", kingFisherModel.getCnv());
        assertEquals("clinical3", kingFisherModel.getClinical());

    }



    // clear database
    @After
    public void tearDown() {
        repo.deleteAll();
    }

}
