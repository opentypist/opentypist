package com.opentypist.persist;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;
import java.util.Random;

@Entity
public class Result {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private String name;

    @CreationTimestamp
    @ColumnDefault("CURRENT_TIMESTAMP")
    private Date date;

    private Integer speed;

    public Result() {}

    public Result(Integer speed) {
        this.name = "Typer-" + new Random().nextInt(10000);
        this.speed = speed;
    }

    public Long getId() {
        return id;
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
