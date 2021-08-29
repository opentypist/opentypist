package com.opentypist.controller;

import com.opentypist.persist.Result;
import com.opentypist.persist.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class HighscoresController {

    @Autowired
    private ResultRepository resultRepository;

    @GetMapping("/highscores")
    public ModelAndView highscores() {
        ModelAndView mav = new ModelAndView("highscores");

        List<Result> results = resultRepository.findAll().stream()
                .sorted((r1, r2) -> Integer.compare(r2.getSpeed(), r1.getSpeed()))
                .collect(Collectors.toList());

        mav.addObject("results", results);
        return mav;
    }
}
