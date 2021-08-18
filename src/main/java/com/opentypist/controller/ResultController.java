package com.opentypist.controller;

import com.opentypist.persist.Result;
import com.opentypist.persist.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ResultController {
    @Autowired
    private ResultRepository resultRepository;

    @PostConstruct
    public void onStart() {
        resultRepository.save(new Result(123));
    }

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
    public Map<String, String> postResult(@RequestParam Integer speed) {
        Result result = resultRepository.save(new Result(speed));
        Map<String, String> map = new HashMap<>();
        map.put("id", result.getId().toString());
        return map;
    }
}
