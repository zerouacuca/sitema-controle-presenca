// src/main/java/com/example/presenca_system/service/PDFService.java
package com.example.presenca_system.service;

import com.example.presenca_system.model.Certificado;
import com.lowagie.text.DocumentException;

import java.io.IOException;

public interface PDFService {
    byte[] gerarCertificadoPDF(Certificado certificado) throws IOException, DocumentException;
    byte[] gerarPDFConsolidado(Long eventoId) throws IOException, DocumentException;
}