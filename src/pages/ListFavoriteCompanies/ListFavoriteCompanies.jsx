import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background-color: ${({ scroll }) => (scroll ? `palegoldenrod` : `#ffffff67`)};
  min-height: 700px;
  max-height:900px;
  overflow: auto;
  border-radius:5px;
  margin-top:2rem;
  padding:1rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin: auto;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: #333;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 75%;
  width: 100%;
  margin-bottom: 20px;
`;

const GroupTitle = styled.h3`
background-color: burlywood;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
`;

const Field = styled.div`
  flex: 1 1 calc(50% - 10px);
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  font-weight: bold;
`;

const FieldValue = styled.span`
  max-width: 60%;
  word-wrap: break-word;
  text-align: right;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FavoriteCompanyForm = ({ companies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scroll, setScrolled] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setScrolled(false);
        }, 500);
    }, [scroll]);

    const handleNext = () => {
        if (currentIndex < companies.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentCompany = companies[currentIndex];

    const addressFields = [
        { label: 'Tipo Logradouro', value: currentCompany.tipoLogradouro },
        { label: 'Logradouro', value: currentCompany.logradouro },
        { label: 'Número', value: currentCompany.numero },
        { label: 'Complemento', value: currentCompany.complemento },
        { label: 'Bairro', value: currentCompany.bairro },
        { label: 'CEP', value: currentCompany.CEP },
        { label: 'Município', value: currentCompany.Municipio },
        { label: 'UF', value: currentCompany.UF },
        { label: 'País', value: currentCompany.pais },
    ];

    const contactFields = [
        { label: 'DDD Telefone', value: currentCompany.DDD_Telefone },
        { label: 'Telefone', value: currentCompany.telefone },
        { label: 'DDD Celular', value: currentCompany.DDD_Celular },
        { label: 'Celular', value: currentCompany.celular },
        { label: 'DDD Fax', value: currentCompany.DDD_Fax },
        { label: 'Fax', value: currentCompany.Fax },
        { label: 'Correio Eletrônico', value: currentCompany.correio_eletronico },
    ];

    const companyFields = [
        { label: 'CNPJ', value: currentCompany.cnpj },
        { label: 'Nome', value: currentCompany.nome },
        { label: 'Nome Fantasia', value: currentCompany.nomeFantasia },
        { label: 'Razão Social', value: currentCompany.razaoSocial },
        { label: 'Natureza', value: currentCompany.natureza },
        { label: 'Porte', value: currentCompany.porte },
        { label: 'Situação', value: currentCompany.situacao },
        { label: 'Motivo Situação', value: currentCompany.motivoSituacao },
        { label: 'Data Início', value: currentCompany.dataInicio },
        { label: 'Data Regime', value: currentCompany.dataRegime },
        { label: 'Regime', value: currentCompany.regime },
        { label: 'Data Situação', value: currentCompany.dataSituacao },
        { label: 'Situação Especial', value: currentCompany.situacao_especial },
        { label: 'Data Situação Especial', value: currentCompany.data_sit_especial },
        { label: 'CNAE Principal', value: currentCompany.cnaePrincipal },
        { label: 'CNAE Secundária', value: currentCompany.cnaeSecundaria },
        { label: 'Ente Responsável', value: currentCompany.ente_responsavel },
        { label: 'Qualificação do Responsável', value: currentCompany.qualificacao_do_responsavel },
        { label: 'Capital', value: currentCompany.capital },
    ];

    return (
        <Box
            scroll={scroll}
            onScroll={() => {
                setScrolled(true);
            }}
        >
            <h2>Lista de Companias</h2>
            <FormContainer>
                <GroupContainer>
                    <GroupTitle>Endereço</GroupTitle>
                    <FieldContainer>
                        {addressFields.map(field => (
                            <Field key={field.label}>
                                <FieldLabel>{field.label}:</FieldLabel>
                                <FieldValue>{field.value}</FieldValue>
                            </Field>
                        ))}
                    </FieldContainer>
                </GroupContainer>

                <GroupContainer>
                    <GroupTitle>Contato</GroupTitle>
                    <FieldContainer>
                        {contactFields.map(field => (
                            <Field key={field.label}>
                                <FieldLabel>{field.label}:</FieldLabel>
                                <FieldValue>{field.value}</FieldValue>
                            </Field>
                        ))}
                    </FieldContainer>
                </GroupContainer>

                <GroupContainer>
                    <GroupTitle>Empresa</GroupTitle>
                    <FieldContainer>
                        {companyFields.map(field => (
                            <Field key={field.label}>
                                <FieldLabel>{field.label}:</FieldLabel>
                                <FieldValue>{field.value}</FieldValue>
                            </Field>
                        ))}
                    </FieldContainer>
                </GroupContainer>

                <ButtonContainer>
                    <Button onClick={handlePrev} disabled={currentIndex === 0}>
                        Anterior
                    </Button>
                    <Button onClick={handleNext} disabled={currentIndex === companies.length - 1}>
                        Próximo
                    </Button>
                </ButtonContainer>
            </FormContainer>
        </Box>
    );
};

export default FavoriteCompanyForm;
