using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.input
{
    public class OrderInputDto
    {
        public int? OrderId { get; set; } // null si es nueva orden
        public DateTime? OrderDate { get; set; }

        public CustomerReferenceDto Customer { get; set; }
        public EmployeeReferenceDto Employee { get; set; }
        public ShippingAddressInputDto ShippingAddress { get; set; }

        public List<OrderDetailInputDto> OrderDetails { get; set; }
    }
}