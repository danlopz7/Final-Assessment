using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class ProductSimpleDto
    {
        public int? Id { get; set; }
        public string ProductName { get; set; }
        public decimal? UnitPrice { get; set; }
    }
}