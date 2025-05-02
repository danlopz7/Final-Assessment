using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.input
{
    public class OrderDetailInputDto
    {
        public ProductReferenceDto Product { get; set; }
        public short Quantity { get; set; }
    }
}