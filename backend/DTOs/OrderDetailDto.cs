using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class OrderDetailDto
    {
        public ProductSimpleDto Product { get; set; }
        public short Quantity { get; set; }
    }
}