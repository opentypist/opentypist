package com.opentypist.persist;

import javax.persistence.*;

@Entity
public class Quote {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    @Column(length = 1337)
    private String quote;

    private Quote() {}

    public Quote(String quote) {
        this.quote = quote;
    }

    public Integer getId() {
        return id;
    }

    public String getQuote() {
        return quote;
    }
}
