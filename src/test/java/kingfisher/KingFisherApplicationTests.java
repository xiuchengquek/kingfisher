package kingfisher;

import com.google.gson.reflect.TypeToken;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;


import com.google.gson.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;



import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.lang.reflect.Type;
import java.util.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = KingFisherApplication.class)
@WebAppConfiguration
public class KingFisherApplicationTests {


	@Autowired
    KingFisherRestController kingRestController;

	@Autowired
	KingFisherRepository repo;


	KingFisherModel test;
	KingFisherModel test2;



	private MockMvc mockMvc;

    Gson gson = new GsonBuilder().create();


    @Before
	public void setUp() throws Exception {

		mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

		repo.deleteAll();
		test = new KingFisherModel("test" , "maf", "cnv", "clinical");
		test2 = new KingFisherModel("test2" , "maf2", "cnv2", "clinical2");
		repo.save(test);
		repo.save(test2);



	}

	@Autowired
	WebApplicationContext wac;

    @Test public void homeView() throws Exception{
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());

    }


    @Test public void protoTypeView() throws Exception{
        mockMvc.perform(get("/prototype"))
                .andExpect(status().isOk());

    }

	@Test
	public void testRestGet() throws Exception{


        List<KingFisherModel> expectedList =  Arrays.asList(test, test2);
        String expectedListString = gson.toJson(expectedList);

		mockMvc.perform(get("/rest"))
				.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON+ ";charset=UTF-8"))
                .andExpect(content().string(expectedListString));


        // Test to check that filter works.

        Type listType = new TypeToken<ArrayList<KingFisherModel>>() {
        }.getType();


        MvcResult results = mockMvc.perform(get("/rest?title=test"))
				.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8"))
                .andReturn();


        String content = results.getResponse().getContentAsString();
        List<KingFisherModel> kingFisherModelList = gson.fromJson(content, listType);

        assertEquals(test.getMaf(), kingFisherModelList.get(0).getMaf());



	}

    @Test
    public void testRestPost() throws Exception {



        Map<String, String> testParameters = new HashMap<>();

        testParameters.put("title", "test3");
        testParameters.put("maf", "maf3");
        testParameters.put("cnv", "cnv3");
        testParameters.put("clinical", "clinical3");

        String testJson = gson.toJson(testParameters);



        MvcResult results = mockMvc.perform(post("/rest")
               .contentType(MediaType.APPLICATION_JSON)
               .content(testJson))
               .andExpect(status().isOk())
                .andReturn();

       String content = results.getResponse().getContentAsString();
       KingFisherModel kingFisherModel = gson.fromJson(content, KingFisherModel.class);

       assertEquals("test3", kingFisherModel.getTitle());
       assertEquals("maf3", kingFisherModel.getMaf());
       assertEquals("cnv3", kingFisherModel.getCnv());
       assertEquals("clinical3", kingFisherModel.getClinical());









    }

    @After
    public void tearDown() {
        repo.deleteAll();
    }




}
