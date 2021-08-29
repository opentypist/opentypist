package com.opentypist.persist;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.Random;

@Entity
public class Result {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Quote quote;

    private String name;

    @CreationTimestamp
    private Date date;

    private Integer speed;

    private Result() {}

    public Result(Quote quote, Integer speed) {
        this.quote = quote;
        this.name = "Typer-" + new Random().nextInt(10000);
        this.speed = speed;
    }

    public Long getId() {
        return id;
    }

    public Quote getQuote() {
        return quote;
    }

    public String getName() {
        return name;
    }

    public Date getDate() {
        return date;
    }

    public Integer getSpeed() {
        return speed;
    }
}
