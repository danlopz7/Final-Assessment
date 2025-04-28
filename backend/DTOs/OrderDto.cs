using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public DateTime? OrderDate { get; set; }
        public CustomerSimpleDto Customer { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; }
        public EmployeeSimpleDto Employee { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; }
    }
}