package com.opentypist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Description;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ViewResolver;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.util.Optional;

@RestController
@RequestMapping("api")
public class QuoteController {

    @Autowired
    private QuoteRepository quoteRepository;

    @PostMapping(path="/add")
    public @ResponseBody String addQuote(@RequestParam String quoteText) {
        Quote quote = new Quote(quoteText);
        quoteRepository.save(quote);
        return "Saved :)";
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Quote> getAllQuotes() {
        return quoteRepository.findAll();
    }

    @RequestMapping(path="/random")
    public ResponseEntity<Quote> random() {
        long totalQuotes = quoteRepository.count();
        int targetQuoteId = (int)(Math.random() * totalQuotes) + 1;
        Optional<Quote> quote = quoteRepository.findById(targetQuoteId);
        return ResponseEntity.of(quote);
    }
}
