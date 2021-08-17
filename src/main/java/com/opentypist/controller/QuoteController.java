package com.opentypist.controller;

import com.opentypist.persist.Quote;
import com.opentypist.persist.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
