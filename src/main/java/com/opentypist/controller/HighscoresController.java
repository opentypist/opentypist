package com.opentypist.controller;

import com.opentypist.persist.Quote;
import com.opentypist.persist.QuoteRepository;
import com.opentypist.persist.Result;
import com.opentypist.persist.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class HighscoresController {

    @Autowired
    private QuoteRepository quoteRepository;

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

    @GetMapping("/highscores-quote")
    public ModelAndView highscoresQuote(@RequestParam Integer quoteId) {
        ModelAndView mav = new ModelAndView("highscores-quote");

        List<Result> results = resultRepository.findAll().stream()
                .filter(result -> result.getQuote() != null && result.getQuote().getId().equals(quoteId))
                .sorted((r1, r2) -> Integer.compare(r2.getSpeed(), r1.getSpeed()))
                .collect(Collectors.toList());

        Optional<Quote> quote = quoteRepository.findById(quoteId);
        String quoteText;

        if(quote.isPresent())
            quoteText = quote.get().getQuote();
        else
            quoteText = "";

        mav.addObject("results", results);
        mav.addObject("quoteText", quoteText);
        return mav;
    }

}
