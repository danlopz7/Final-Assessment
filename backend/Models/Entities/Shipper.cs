using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models.Entities
{
    public class Shipper
    {
        public int ShipperId { get; set; } // PK
        public string CompanyName { get; set; }
        public string? Phone { get; set; }

        // Navigation property
        public ICollection<Order> Orders { get; set; }
    }
}
