package com.opentypist.controller;

import com.opentypist.persist.Result;
import com.opentypist.persist.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;

@Controller
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
}
