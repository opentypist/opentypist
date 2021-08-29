package com.opentypist.controller;

import com.opentypist.persist.Quote;
import com.opentypist.persist.QuoteRepository;
import com.opentypist.persist.Result;
import com.opentypist.persist.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private QuoteRepository quoteRepository;

    @GetMapping("/result")
    public ModelAndView result(@RequestParam String id) {
        ModelAndView modelAndView = new ModelAndView("result");

        try {
            Long resultId = Long.parseLong(id);
            Result result = resultRepository.findById(resultId).get();
            modelAndView.addObject("result", result);
        } catch (Exception e) {
            return new ModelAndView("error");
        }

        return modelAndView;
    }

    @PostMapping("/post-result")
    public Map<String, String> postResult(@RequestParam Integer speed, @RequestParam Integer quoteId) {
        Quote quote = quoteRepository.findById(quoteId).get();
        Result result = resultRepository.save(new Result(quote, speed));
        Map<String, String> map = new HashMap<>();
        map.put("id", result.getId().toString());
        return map;
    }
}
