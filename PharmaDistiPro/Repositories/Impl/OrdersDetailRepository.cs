using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class OrdersDetailRepository : RepositoryBase<OrdersDetail>, IOrdersDetailRepository
    {
        public OrdersDetailRepository(SEP490_G74Context context) : base(context)
        {
        }
    }
}
