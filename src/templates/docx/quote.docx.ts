import {
  AlignmentType,
  convertInchesToTwip,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  VerticalAlign,
  WidthType
} from 'docx';

import Service from 'models/Service.model';

const quote = async (service: Service): Promise<Packer> => {
  const copsTableContent = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Cant.',
                  bold: true
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 0
              }
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'f7f7f7',
            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
            color: 'auto'
          }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Descripción',
                  bold: true
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 0
              }
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'f7f7f7',
            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
            color: 'auto'
          }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Turno',
                  bold: true
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 0
              }
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'f7f7f7',
            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
            color: 'auto'
          }
        }),
        new TableCell({
          children: [
            new Paragraph({
              spacing: {
                after: 0
              },
              alignment: AlignmentType.CENTER,
              text: 'Costo diario'
            }),
            new Paragraph({
              spacing: {
                after: 0
              },
              alignment: AlignmentType.CENTER,
              text: 'Unitario'
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'f7f7f7',
            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
            color: 'auto'
          }
        }),
        new TableCell({
          children: [
            new Paragraph({
              spacing: {
                after: 0
              },
              alignment: AlignmentType.CENTER,
              text: 'Costo unitario'
            }),
            new Paragraph({
              spacing: {
                after: 0
              },
              alignment: AlignmentType.CENTER,
              text: 'Mensual'
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'f7f7f7',
            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
            color: 'auto'
          }
        }),
        new TableCell({
          children: [
            new Paragraph({
              spacing: {
                after: 0
              },
              alignment: AlignmentType.CENTER,
              text: 'Costo total'
            }),
            new Paragraph({
              spacing: {
                after: 0
              },
              alignment: AlignmentType.CENTER,
              text: 'Mensual'
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'f7f7f7',
            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
            color: 'auto'
          }
        })
      ]
    })
  ];
  service.offices.forEach((office) => {
    copsTableContent.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${office.name}`,
                    bold: true
                  })
                ],
                spacing: {
                  after: 0
                },
                alignment: AlignmentType.CENTER
              })
            ]
          })
        ]
      })
    );
    office.profiles.forEach((profile) => {
      copsTableContent.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: `${profile.total}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 0
                  }
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `${profile.copType.name}`,
                  spacing: {
                    after: 0
                  }
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `${profile.shiftType.work}x${profile.shiftType.rest}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 0
                  }
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `$${(parseInt(profile.cost) / 100).toLocaleString()}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 0
                  }
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `$${(
                    (30 * parseInt(profile.cost)) /
                    100
                  ).toLocaleString()}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 0
                  }
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `$${(
                    (30 * parseInt(profile.cost) * profile.total) /
                    100
                  ).toLocaleString()}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 0
                  }
                })
              ]
            })
          ]
        })
      );
    });
  });
  const copsTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    columnWidths: [
      convertInchesToTwip(0.65),
      convertInchesToTwip(2.62),
      convertInchesToTwip(0.65),
      convertInchesToTwip(1.04),
      convertInchesToTwip(1.12),
      convertInchesToTwip(1.08)
    ],
    margins: {
      top: convertInchesToTwip(0.1),
      bottom: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.05),
      left: convertInchesToTwip(0.05)
    },
    rows: copsTableContent
  });
  const quoteContent = [
    new Paragraph({
      text: `Agradezco mucho su tiempo para poder presentarle la siguiente propuesta de servicio de SEGURIDAD PRIVADA para el PROYECTO ${service.partner.name.toUpperCase()}:`
    }),
    new Paragraph({
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'Dentro de nuestro servicio como Empresa de Seguridad Privada, incluimos:'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: 0
      },
      text: 'Uniforme'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: 0
      },
      text: 'Equipo'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: 0
      },
      text: 'Telefonia movil'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      text: 'Radios para comunicacion interna'
    }),
    new Paragraph({
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'El uniforme de elemento razo consta de:'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Camisola'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Pantalon tipo comando'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Chamarra de mangas desmontables'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Calzado de seguridad'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'PR24'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Lampara LED de largo alcance'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      text: 'Capa y calzado imprermeable'
    }),
    new Paragraph({
      text: 'De igual manera se contempla:'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      children: [
        new TextRun({
          text: 'EVALUACION DE RIESGO PREVIA A LA INSTALACIÓN',
          bold: true
        })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Dicha evaluación permite identificar las zonas de riesgo físicas y de procesos, una vez emitido el Diagnóstico de Riesgo, se hacen las propuestas de mejora y '
        }),
        new TextRun({
          text: 'se implementa un Sistema de Gestión de Seguridad específico para su empresa',
          bold: true
        }),
        new TextRun({
          text: ', que abarca:'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 0
      },
      spacing: {
        after: 0
      },
      children: [
        new TextRun({
          text: 'Procedimientos',
          bold: true
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 1
      },
      spacing: {
        after: 0
      },
      children: [
        new TextRun({
          text: 'Control de accesos'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 1
      },
      spacing: {
        after: 0
      },
      children: [
        new TextRun({
          text: 'Control vehicular'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 1
      },
      spacing: {
        after: 0
      },
      children: [
        new TextRun({
          text: 'Control de bienes'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 1
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      children: [
        new TextRun({
          text: 'Los aplicables al servicio'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 0
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      children: [
        new TextRun({
          text: 'Formatos',
          bold: true
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 0
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      children: [
        new TextRun({
          text: 'Manuales / Instructivos',
          bold: true
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 0
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      children: [
        new TextRun({
          text: 'Indicadores / Registros de calidad',
          bold: true
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-crazy-numbering',
        level: 0
      },
      children: [
        new TextRun({
          text: 'Mapa de riesgo',
          bold: true
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      children: [
        new TextRun({
          text: 'IMPLEMENTACIÓN DE SISTEMA TECNOLÓGICO DE ',
          bold: true
        }),
        new TextRun({
          text: 'RONDINES Y CONTROL DE ACCESOS',
          bold: true,
          underline: {
            type: UnderlineType.SINGLE,
            color: '000'
          }
        }),
        new TextRun({
          text: '.',
          bold: true
        })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Monitoreo de las actividades del personal de seguridad en tiempo real, lo que mejora el conocimiento situacional, eleva el control de calidad y disminuye el tiempo de respuesta para solución. Permite un práctico acceso a la información, recepción de informes y recepción de notificaciones según sus especificaciones.'
        })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'NOTIFICACIONES INSTANTANEAS: ',
          bold: true
        }),
        new TextRun({
          text: 'A través del correo electrónico y mensaje SMS, usted recibe notificaciones sobre eventos planificados o incidentes en tiempo real. El personal de seguridad podrá compartir en momento real datos, fotos y videos de algún incidente crítico en todo momento'
        })
      ]
    }),
    new Paragraph({
      text: 'Reportes en tiempo real de:',
      spacing: {
        after: convertInchesToTwip(0.05)
      }
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Inicio y termino de turno del personal de seguridad (asistencia)'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Control de visitantes(provedores, contratistas, invitados, etc).'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Control de llaves / bienes / unidades utilitarias'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Alertas rapidas (incidentes)'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Rondas de seguridad'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      text: 'Instrucciones al personal de seguridad'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      text: 'CAPACITACIÓN DEL PERSONAL'
    }),
    new Paragraph({
      text: 'Nuestro personal es capacitado de manera permanente, en los siguientes rubros: '
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Consignas generales y consignas especificas'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Emergencias operativas'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Llamadas de extorsión'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Primeros auxilios básico e intermedio'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Brigadas.- Combate de incendio'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Brigadas.- Busqueda y rescate'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Comunicacion asertiva'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Elaboracion de reportes'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Linea de mando'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Manejo de PR24 y defensa personal'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      spacing: {
        after: 0
      },
      text: 'Uso legal de la fuerza'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      text: 'Capacitacion especifica de acuerdo con las necesidades del servicio'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      text: 'PRESTACIONES ADICIONALES AL PERSONAL'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      children: [
        new TextRun({
          text: 'El guardia recibe un '
        }),
        new TextRun({
          text: 'bono de productividad',
          bold: true
        }),
        new TextRun({
          text: 'de acuerdo con el desempeño en lo laboral que durante el mes haya tenido. (Dicha evaluación se realiza entre el Jefe Operativo y el Cliente).'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'Pago por prevención de pérdidas. Este pago será dado en la quincena que corresponda cuando el elemento detecte algún ilícito de gravedad.'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'Bonos especiales por temporada: día de reyes, útiles escolares, paternidad etc. (Condicionados bajo previa evaluación).'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      text: 'GARANTIA DE SERVICIO'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      children: [
        new TextRun({
          text: 'Poliza de garantia',
          bold: true
        }),
        new TextRun({
          text: '. - La fianza de fidelidad tiene como objetivo estratégico el proteger el patrimonio de las empresas de posibles quebrantos derivados de conductas delictivas por parte de nuestros guardias.'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      children: [
        new TextRun({
          text: 'Certificación BASC-OEA',
          bold: true
        }),
        new TextRun({
          text: '.- Lineamientos C-TPAT'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      text: 'OBSERVACIONES IMPORTANTES'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      text: 'Nuestros cobros son quincenales o mensuales (de acuerdo con cada socio comercial) y deberán de ser cubiertos 3 días después de finalizar cada quincena o mes.'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      children: [
        new TextRun({
          text: 'Nuestros guardias cuentan con todas las prestaciones que marca la Ley Federal del Trabajo, por lo que '
        }),
        new TextRun({
          text: 'el cliente queda libre de cualquier responsabilidad laboral o legal.'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      text: 'Nuestro plan de capacitación está registrado ante la STyPS'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 3
      },
      text: 'Nuestra empresa cubre el salario de vacaciones, días festivos, descansos y aguinaldos, sin que esto represente un costo extra para su empresa.'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      text: 'SUPERVISION'
    }),
    new Paragraph({
      text: 'La supervisión es permanente, en unidades móviles las 24 horas de los 365 días del año.'
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Nota:',
          bold: true
        }),
        new TextRun({
          text: 'Permanencia de patrulla en horarios vulnerables'
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 0
      },
      text: 'PROPUESTA CON PERSONAL'
    }),
    copsTable,
    new Paragraph({
      children: [
        new TextRun({
          text: '*Precio sin IVA',
          bold: true
        })
      ],
      spacing: {
        before: convertInchesToTwip(0.05)
      }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'ESPECIFICACIONES',
          bold: true
        })
      ]
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'Nuestra empresa cubre el salario de vacaciones, días festivos, descansos y aguinaldos, sin que esto represente un costo extra para su empresa.'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'Son monitoreados las 24 horas mediante, Supervisión Operativa móvil, supervisión de Radio Operadores, monitoreo de CCTV y mediante el sistema Tecnológico Trackforce, para acción inmediata ante cualquier evento de riesgo;'
    }),
    new Paragraph({
      numbering: {
        reference: 'my-unique-bullet-points',
        level: 2
      },
      spacing: {
        after: convertInchesToTwip(0.05)
      },
      text: 'La evaluación de riesgos que realizamos previo a la prestación de servicio nos ayuda a identificar procesos de riesgo, para reforzar la seguridad con Tecnología y no con personal armado.'
    }),
    new Paragraph({
      text: 'Esperando que la presente propuesta sea de su entera satisfacción, quedo al pendiente para cualquier duda o comentario al respecto.'
    })
  ];
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          // Only `name` prop required, `id` not necessary
          id: 'Normal',
          name: 'Normal',
          run: {
            font: 'Arial'
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: convertInchesToTwip(0.15)
            }
          }
        }
      ]
    },
    numbering: {
      config: [
        {
          reference: 'my-crazy-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1. ',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.2),
                    hanging: convertInchesToTwip(0.18)
                  },
                  spacing: {
                    after: convertInchesToTwip(0.8)
                  }
                }
              }
            },
            {
              level: 1,
              format: LevelFormat.LOWER_LETTER,
              text: '%2)',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.3),
                    hanging: convertInchesToTwip(0.18)
                  },
                  spacing: {
                    after: convertInchesToTwip(0.5)
                  }
                }
              }
            },
            {
              level: 2,
              format: LevelFormat.DECIMAL_ENCLOSED_CIRCLE,
              text: '%3',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(1),
                    hanging: convertInchesToTwip(0.18)
                  },
                  spacing: {
                    after: convertInchesToTwip(0.2)
                  }
                }
              }
            },
            {
              level: 3,
              format: LevelFormat.LOWER_LETTER,
              text: '%4)',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(1.2),
                    hanging: convertInchesToTwip(0.18)
                  },
                  spacing: {
                    after: convertInchesToTwip(0.1)
                  }
                }
              }
            }
          ]
        },
        {
          reference: 'my-unique-bullet-points',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u25CF',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.2),
                    hanging: convertInchesToTwip(0.18)
                  }
                }
              }
            },
            {
              level: 1,
              format: LevelFormat.BULLET,
              text: '\u25D8',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.3),
                    hanging: convertInchesToTwip(0.18)
                  },
                  spacing: {
                    after: convertInchesToTwip(0.01)
                  }
                }
              }
            },
            {
              level: 2,
              format: LevelFormat.BULLET,
              text: '\u25D6',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.4),
                    hanging: convertInchesToTwip(0.18)
                  }
                }
              }
            },
            {
              level: 3,
              format: LevelFormat.BULLET,
              text: '\u25D7',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.18)
                  }
                }
              }
            },
            {
              level: 4,
              format: LevelFormat.BULLET,
              text: '\u267A',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.6),
                    hanging: convertInchesToTwip(0.18)
                  }
                }
              }
            }
          ]
        }
      ]
    },
    sections: [
      {
        children: quoteContent
      }
    ]
  });
  // Used to export the file into a .docx file
  return Packer.toBuffer(doc).then((buffer) => {
    return buffer;
  });
};
export default quote;
