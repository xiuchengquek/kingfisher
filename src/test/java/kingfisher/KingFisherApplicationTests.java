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
		test = new KingFisherModel("lol" , "chey");
		test2 = new KingFisherModel("death" , "great");
		repo.save(test);
		repo.save(test2);



	}

	@Autowired
	WebApplicationContext wac;

    @Test public void homeView() throws Exception{
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.TEXT_HTML+";charset=UTF-8"));
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


        MvcResult results = mockMvc.perform(get("/rest?title=lol"))
				.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8"))
                .andReturn();


        String content = results.getResponse().getContentAsString();
        List<KingFisherModel> kingFisherModelList = gson.fromJson(content, listType);

        assertEquals(test.getData(), kingFisherModelList.get(0).getData());



	}

    @Test
    public void testRestPost() throws Exception {



        Map<String, String> testParameters = new HashMap<>();

        testParameters.put("title", "HELLOW");
        testParameters.put("data", "DARTH");

        String testJson = gson.toJson(testParameters);



        MvcResult results = mockMvc.perform(post("/rest")
               .contentType(MediaType.APPLICATION_JSON)
               .content(testJson))
               .andExpect(status().isOk())
                .andReturn();

       String content = results.getResponse().getContentAsString();
       KingFisherModel kingFisherModel = gson.fromJson(content, KingFisherModel.class);

       assertEquals("HELLOW", kingFisherModel.getTitle());








    }

    @After
    public void tearDown() {
        repo.deleteAll();
    }




}
