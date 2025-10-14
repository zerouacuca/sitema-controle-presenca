package com.example.presenca_system.model.enums;

public enum StatusEvento {
    AGENDADO("agendado"),
    EM_ANDAMENTO("em andamento"), 
    FINALIZADO("finalizado"),
    CANCELADO("cancelado");
    //   PAUSADO REMOVIDO para simplificar

    private final String descricao;

    StatusEvento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusEvento fromDescricao(String descricao) {
        for (StatusEvento status : StatusEvento.values()) {
            if (status.descricao.equalsIgnoreCase(descricao)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status não encontrado: " + descricao);
    }
}