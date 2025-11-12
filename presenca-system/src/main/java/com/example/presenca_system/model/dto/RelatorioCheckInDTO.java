package com.example.presenca_system.model.dto;

import com.example.presenca_system.model.CheckIn;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class RelatorioCheckInDTO {
    private String matriculaUsuario;
    private String nomeUsuario;
    private String emailUsuario;
    private String setorUsuario;
    private String dataHoraCheckin;

    public RelatorioCheckInDTO(CheckIn checkIn) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.matriculaUsuario = checkIn.getUsuario().getMatricula();
        this.nomeUsuario = checkIn.getUsuario().getNome();
        this.emailUsuario = checkIn.getUsuario().getEmail();
        this.setorUsuario = checkIn.getUsuario().getSetor();
        this.dataHoraCheckin = (checkIn.getDataHoraCheckin() != null) ? sdf.format(checkIn.getDataHoraCheckin()) : "N/A";
    }
}