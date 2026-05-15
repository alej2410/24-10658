#include <vector>
#include <cmath>

using namespace std;

int main(){
  return 0;
}

double mean(vector<double> v){
    if (v.empty()) return 0.0;
  
    double sum = 0.0;
    for(double x:v){
        sum += x;
    }
    return sum / v.size();
}

double variance(vector<double> v){
    int n = v.size();
    if (n < 2) return 0.0;
  
    double sum = 0.0;
    double sum_sq = 0.0;

    for (double x : v){
        sum    += x;
        sum_sq += x * x;
    }
    return (sum_sq - (sum * sum) / n) / (n - 1);
}

double pearson_r(vector<double> A, vector<double> B) {
    if (A.empty() || A.size() != B.size()) return 0.0;
 
    int n = A.size();
 
    double sum_A = 0.0, sum_B = 0.0;
    for (double a : A) sum_A += a;
    for (double b : B) sum_B += b;
    double mean_A = sum_A / n;
    double mean_B = sum_B / n;
 
    double num = 0.0, den_A = 0.0, den_B = 0.0;
    for (int i = 0; i < n; i++) {
        double diff_A = A[i] - mean_A;
        double diff_B = B[i] - mean_B;
        num   += diff_A * diff_B;
        den_A += diff_A * diff_A;
        den_B += diff_B * diff_B;
    }
 
    if (den_A == 0.0 || den_B == 0.0) return 0.0;
 
    return num / sqrt(den_A * den_B);
}

// Convierte vector<char> en cierta base a long long (maneja negativos y vacío)
static long long vec_to_ll(vector<char> s, int base) {
    if (s.empty()) return 0;
 
    bool is_negative = (s[0] == '-');
    int start = is_negative ? 1 : 0;
 
    long long result = 0;
    for (size_t i = start; i < s.size(); ++i) {
        int val = 0;
        if (s[i] >= '0' && s[i] <= '9') val = s[i] - '0';
        else if (s[i] >= 'A' && s[i] <= 'F') val = s[i] - 'A' + 10;
        else if (s[i] >= 'a' && s[i] <= 'f') val = s[i] - 'a' + 10;
        result = result * base + val;
    }
 
    return is_negative ? -result : result;
}
 
// Convierte long long a vector<char> en cierta base (maneja negativos, sin includes extra)
static vector<char> ll_to_vec(long long n, int base) {
    if (n == 0) return {'0'};
 
    vector<char> result;
    bool is_negative = (n < 0);
    unsigned long long un = is_negative ? (unsigned long long)(-n) : (unsigned long long)n;
 
    while (un > 0) {
        int rem = (int)(un % base);
        result.push_back(rem < 10 ? '0' + rem : 'A' + (rem - 10));
        un /= base;
    }
 
    if (is_negative) result.push_back('-');
 
    // Invertir manualmente (sin necesitar <algorithm>)
    int left = 0, right = (int)result.size() - 1;
    while (left < right) {
        char temp = result[left];
        result[left] = result[right];
        result[right] = temp;
        left++;
        right--;
    }
 
    return result;
}
 
vector<char> dec_to_septapus(int n){return ll_to_vec(n, 7);}
vector<char> dec_to_octopus(int n){return ll_to_vec(n, 8);}
vector<char> dec_to_hexakaidecapus(int n){return ll_to_vec(n, 16);}
vector<char> septapus_to_dec(vector<char> s){return ll_to_vec(vec_to_ll(s, 7), 10);}
vector<char> octopus_to_dec(vector<char> s){return ll_to_vec(vec_to_ll(s, 8), 10);}
vector<char> hexakaidecapus_to_dec(vector<char> s){return ll_to_vec(vec_to_ll(s, 16), 10);}
vector<char> septapus_to_octopus(vector<char> s){return ll_to_vec(vec_to_ll(s, 7), 8);}
vector<char> septapus_to_hexakaidecapus(vector<char> s){return ll_to_vec(vec_to_ll(s, 7), 16);}
vector<char> octapus_to_septapus(vector<char> s){return ll_to_vec(vec_to_ll(s, 8), 7);}
vector<char> octopus_to_hexakaidecapus(vector<char> s){return ll_to_vec(vec_to_ll(s, 8), 16);}
vector<char> hexakaidecapus_to_septapus(vector<char> s){return ll_to_vec(vec_to_ll(s, 16), 7);}
vector<char> hexakaidecapus_to_octopus(vector<char> s){return ll_to_vec(vec_to_ll(s, 16), 8);}
