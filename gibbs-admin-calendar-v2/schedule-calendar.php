<?php
/*
Plugin Name: Gibbs Admin calendar v2
Description: Gibbs admin and seasonalbooking calendar
Version: 2.0.0
Author: Gibbs team
*/




//Checking to see if user is login 
if ( ! defined( 'ABSPATH' ) ) exit;
function get_current_user_id_custom($cuser_id){
//IF $cuser_id=0 do something
global $wpdb;
$users_table =$wpdb->prefix .'users_and_users_groups';
if($cuser_id){
    $group_id_data = $wpdb->get_results("SELECT users_groups_id FROM $users_table WHERE `users_id`=$cuser_id");
    $group_ids = array();
    foreach ($group_id_data as $key => $group_id) {
        $group_ids[] = $group_id->users_groups_id;
    }
    return $group_ids;
}else{
    return 5;
}

}
function wpm_schedule_calendar_stylesheet(){



wp_enqueue_script( 'momentjs', plugin_dir_url(__FILE__) .'js/moment.js', array(), null, true);
wp_enqueue_script( 'datatable-jquery', plugin_dir_url(__FILE__).'js/jquery.dataTables.min.js',array(),null,true);
wp_enqueue_script( 'datatable-bootstrap-js', plugin_dir_url(__FILE__).'js/dataTables.bootstrap4.min.js',array(),null,true);
wp_enqueue_script( 'multiselect', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js', array(), null, true );



wp_localize_script('custom-script', 'script_vars', array(
    'current_user_jwt'  => Jwt_Auth_Public::generate_token_loggedin_user()
));

wp_enqueue_style( 'multiselect', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css',array('calender-style') );
wp_enqueue_style( 'fullcalendar', plugin_dir_url(__FILE__) . 'fullcalendar/main.css',array('calender-style') );
wp_enqueue_style( 'mobiscroll', plugin_dir_url(__FILE__) . 'mobiscroll.custom/css/mobiscroll.jquery.min.css',array('calender-style') );
wp_enqueue_script( 'dayjs', 'https://unpkg.com/dayjs@1.8.21/dayjs.min.js', array(),null,true );
wp_enqueue_script( 'dayjs', 'https://unpkg.com/dayjs@1.8.21/plugin/advancedFormat.js', array(),null,true ); 
wp_enqueue_script( 'daterange',"https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js", array(),null,true );

wp_enqueue_script( 'customselect', 'https://jqueryniceselect.hernansartorio.com/js/jquery.nice-select.min.js', array(),null,true );  
wp_enqueue_script( 'mobiscroll', plugin_dir_url(__FILE__) . 'mobiscroll.custom/js/mobiscroll.jquery.min.js', array(),null,true );



wp_enqueue_script( 'custom-script', plugin_dir_url(__FILE__) . 'js/script.js', array( 'jquery' ), time(), true );   

wp_localize_script( 'custom-script', 'WPMAddRecord', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
wp_localize_script( 'custom-script', 'WPMDeleteRecord', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
wp_localize_script( 'custom-script', 'GetBookingByClub', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
wp_localize_script( 'custom-script', 'GetBookingByUser', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
wp_localize_script( 'custom-script', 'GetTeamsByClient', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
wp_localize_script( 'custom-script', 'AdminajaxUrl', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );

wp_enqueue_style( 'kendo-common', plugin_dir_url(__FILE__) . 'kendo/styles/kendo.common.min.css', array( 'calender-style' ), '20210406' );
wp_enqueue_style( 'kendo-default', plugin_dir_url(__FILE__) . 'kendo/styles/kendo.default.min.css', array( 'calender-style' ), '20210406' );
wp_enqueue_style( 'kendo-default-mobile', plugin_dir_url(__FILE__) . 'kendo/styles/kendo.default.mobile.min.css', array( 'calender-style' ), '20190406' );

/* wp_enqueue_style( 'kendo-common', plugin_dir_url(__FILE__) . 'kendo/styles/kendo.common.min.css', array( 'calender-style' ), '20210406' );
wp_enqueue_style( 'kendo-default', plugin_dir_url(__FILE__) . 'kendo/styles/kendo.default.min.css', array( 'calender-style' ), '20210406' );
wp_enqueue_style( 'kendo-default-mobile', plugin_dir_url(__FILE__) . 'kendo/styles/kendo.default.mobile.min.css', array( 'calender-style' ), '20190406' );*/


wp_enqueue_style( 'calender-style', plugin_dir_url(__FILE__) . 'css/style.css' ,[],time());
wp_enqueue_style( 'calender-style',"https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" ,[],time());
//  wp_enqueue_style( 'calender-style-css', plugin_dir_url(__FILE__) . 'css/Gibbs.css' ,[],time());
//   wp_enqueue_style( 'calender-style-scss', plugin_dir_url(__FILE__) . 'css/Gibbs.scss' ,[],time());
}
add_action( 'wp_enqueue_scripts', 'wpm_schedule_calendar_stylesheet' );

function wpm_add_record(){

global $wpdb;
$booking_table = $wpdb->prefix . 'bookings_calendar';

$count_query = "select count(*) from $booking_table";
$num = $wpdb->get_var($count_query);
if( $num == NULL ){
    $numbers = 1;
}else{
    $numbers = $num + 1;
}
if($_POST['status'] == "closed"){
    $list_id = $_POST['gymSectionId'];
    $list_table = $wpdb->prefix . 'posts';
    $user_groups_id = $wpdb->get_var("select users_groups_id from $list_table where id=$list_id");
    $closed_user_id = get_current_user_ID();
}else{
    $closed_user_id = '';  
    $user_groups_id  = '';  
}
if($_POST['status'] == "closed"){
    $_POST['status'] = "paid";
    $fixed = "1";
}elseif($_POST['status'] == "sesongbooking"){
    $_POST['status'] = "paid";
    $fixed = "2";
}else{
    $fixed = "0";  
}
$id             = $_POST['id'];
$wpm_client     = $_POST['wpm_client'];
$team           = $_POST['team'];
$start          = $_POST['start'];
$end            = $_POST['end'];
$description    = $_POST['description'];
$repert         = $_POST['repert'];
$status         = $_POST['status'];
$title          = $_POST['title'];
$gymId          = $_POST['gymId'];
$recurrenceRule = $_POST['recurrenceRule'];
$recurrenceId   = $_POST['recurrenceId'];
$gymSectionId   = $_POST['gymSectionId'];
$owner_id = $wpdb->get_var("select post_author from ptn_posts where id=$gymSectionId");

/**/
$insertArr = array(
    'bookings_author'            => $wpm_client,
    'team_id'                    => $team,
    'date_start'                 => date("Y/m/d H:i", strtotime($start)),
    'date_end'                   => date("Y/m/d H:i", strtotime($end)),
    'description'                => $description,
    'repert'                     => $repert,
    'status'                     => $status,
    'title'                      => $title,
    'type'                      => 'reservation',
    'fixed'                     => $fixed,
    'closed_user_id'             => $closed_user_id,
    'closed_user_group_id'  => $user_groups_id,
    'recurrenceRule'             => $recurrenceRule, 
    'recurrenceID'               => $recurrenceId,
    'listing_id'                 => $gymSectionId,
    'owner_id'                   => $owner_id,
);
$insert = $wpdb->insert($booking_table, $insertArr);
wp_send_json(array( 'status' => 200,'client' => $wpm_client,'post' => $_POST));
exit();
}
add_action( 'wp_ajax_nopriv_wpm_add_record', 'wpm_add_record' );
add_action( 'wp_ajax_wpm_add_record', 'wpm_add_record' );

function wpm_delete_record(){

global $wpdb;
$id = $_POST['id'];
$record_table = $wpdb->prefix . 'bookings_calendar';
$wpdb->delete( $record_table, array( 'id' => $id ) );

wp_send_json(array( 'status' => 200 ));
exit();

}
add_action( 'wp_ajax_nopriv_wpm_delete_record', 'wpm_delete_record' );
add_action( 'wp_ajax_wpm_delete_record', 'wpm_delete_record' );

function wpm_update_record(){

global $wpdb;


if(isset($_POST["cal_view"]) && $_POST["cal_view"] == "manuelle"){
    $booking_table = $wpdb->prefix . 'bookings_calendar_raw_approved';
}else{
    $booking_table = $wpdb->prefix . 'bookings_calendar';
}

if(isset($_POST['recurrenceException']) && $_POST['recurrenceException']!= '' && $_POST['recurrenceException']!= 'undefined' && $_POST['recurrenceException']!= 'null' && $_POST['id']!= ''){
    
    $recurrenceException = $wpdb->get_var("select recurrenceException from $booking_table where id=".$_POST['id']);
    $recurrenceException = trim($recurrenceException);
    $recurrenceException = str_replace('[','',$recurrenceException);
    $recurrenceException = str_replace(']','',$recurrenceException);
    if($recurrenceException != '') {
        $recurrenceException .=",'".$_POST['recurrenceException']."'";
    }
    else {
        $recurrenceException .="'".$_POST['recurrenceException']."'";
    }
    $recurrenceException = $_POST['recurrenceException'];
    $sqlrecException = "";
    if($recurrenceException != ''){
        $substr = substr($recurrenceException, 1, strlen($recurrenceException) - 2);
        $substrArr = explode(",", $substr);
        foreach($substrArr as $except){
            $except = substr($except, 2, strlen($except) - 4);
            $except = $except. "T00:00:00.000Z";
            if($sqlrecException == ""){
                $sqlrecException .= $except;
            }else{
                $sqlrecException .= ',' . $except;
            }
        }
    }

    $wpdb->query("UPDATE $booking_table SET recurrenceException='$sqlrecException' WHERE id=".$_POST['id']);
    
    /* $recurrenceRule = $wpdb->get_var("select recurrenceRule from $booking_table where id=".$_POST['id']);
    
    if(strpos($recurrenceRule,'EXDATE') !== FALSE) {
        $recurrenceRuleStart = explode('DTSTART:',$recurrenceRule);
        $recurrenceRuleStart = trim(substr($recurrenceRuleStart[1],9,7));
        $recurrenceRule .=','.$_POST['recurrenceException'].'T'.$recurrenceRuleStart;
    }
    else {
        $recurrenceRuleStart = explode('DTSTART:',$recurrenceRule);
        $recurrenceRuleStart = trim(substr($recurrenceRuleStart[1],9,7));
        $recurrenceRule .='\nEXDATE:'.$_POST['recurrenceException'].'T'.$recurrenceRuleStart;
    }
    $wpdb->query("UPDATE $booking_table SET recurrenceRule='$recurrenceRule' WHERE id=".$_POST['id']); */
    
}

if($_POST['status'] == "closed"){
    $list_id = $_POST['gymSectionId'];
    $list_table = $wpdb->prefix . 'posts';
    $user_groups_id = $wpdb->get_var("select users_groups_id from $list_table where id=$list_id");
    $closed_user_id = get_current_user_ID();
}else{
    $closed_user_id = '';  
    $user_groups_id = '';
}


if($_POST['status'] == "closed"){
    $_POST['status'] = "paid";
    $fixed = "1";
}elseif($_POST['status'] == "sesongbooking"){
        $_POST['status'] = "paid";
        $fixed = "2";
}else{
    $fixed = "0";  
}



$id=$wpm_client=$team=$start=$end=$description=$repert=$status=$recurrenceRule=$recurrenceException=$recurrenceId=$gymSectionId="";
$id             = $_POST['id'];
$wpm_client     = $_POST['wpm_client'];
$team           = $_POST['team'];
$start          = $_POST['start'];
$end            = $_POST['end'];
$description    = $_POST['description'];
$repert         = $_POST['repert'];
$status         = $_POST['status'];
$title          = $_POST['title'];
$recurrenceRule = $_POST['recurrenceRule'];
$recurrenceException = $_POST['recurrenceException'];
$recurrenceId        = $_POST['recurrenceId'];
$gymSectionId   = $_POST['gymSectionId'];
$owner_id = $wpdb->get_var("select post_author from ptn_posts where id=$gymSectionId");

$booking_data = $wpdb -> get_row( 'SELECT * FROM `'  . $booking_table.'` WHERE `id`=' . esc_sql( $id ), 'ARRAY_A' );

$order_id = "";

$send_mail = 0;
if($booking_data){
    if ( $booking_data['status'] != $status ){

        $order_id =  send_mail_booking($booking_table,$id,$status); 
            
    }
}

    
$wpdb->show_errors = true;
if(isset($_POST["cal_view"]) && $_POST["cal_view"] == "manuelle"){
    if(isset($_POST["status_manuale"]) && $_POST["status_manuale"] != ""){
        $rejected = $_POST["status_manuale"];
    }else{
        $rejected = "0";
    }
    $wpdb->update($booking_table, array(
        'bookings_author'            => $wpm_client,
        'date_start'                 => date("Y/m/d H:i", strtotime($start)),
        'date_end'                   => date("Y/m/d H:i", strtotime($end)),
        'description'                => $description,
        'order_id'                => $order_id,
        'closed_user_id'         => $closed_user_id,
        'closed_user_group_id'  => $user_groups_id,
        'recurrenceRule'             => $recurrenceRule, 
        'recurrenceID'               => $recurrenceId,
        'listing_id'                 => $gymSectionId,
        'modified'                   => "1",
        'rejected'                   => $rejected,
        ), array(
            'id'=>$id
            ));
}else{
    $wpdb->update($booking_table, array(
        'bookings_author'            => $wpm_client,
        'team_id'                    => $team,
        'date_start'                 => date("Y/m/d H:i", strtotime($start)),
        'date_end'                   => date("Y/m/d H:i", strtotime($end)),
        'description'                => $description,
        'repert'                     => $repert,
        'status'                     => $status,
        'fixed'                     => $fixed,
        'title'                      => $title,
        'order_id'                => $order_id,
        'closed_user_id'         => $closed_user_id,
        'closed_user_group_id'  => $user_groups_id,
        'recurrenceRule'             => $recurrenceRule, 
        'recurrenceID'               => $recurrenceId,
        'listing_id'                 => $gymSectionId,
        'owner_id'                   => $owner_id,
        ), 
        array(
            'id'=>$id
    ));

}

wp_send_json(array( 'status' => 200 ));
exit();

}
add_action( 'wp_ajax_nopriv_wpm_update_record', 'wpm_update_record' );
add_action( 'wp_ajax_wpm_update_record', 'wpm_update_record' );

function send_mail_booking($booking_table,$booking_id,$status){
global $wpdb;
$order_id = "";
$booking_data = $wpdb -> get_row( 'SELECT * FROM `'  . $booking_table.'` WHERE `id`=' . esc_sql( $booking_id ), 'ARRAY_A' );
if($booking_data){

    $user_id = $booking_data['bookings_author'];
    $owner_id = $booking_data['owner_id'];
    $startDate = $booking_data['date_start'];
    $current_user_id = get_current_user_id();

    $user_info = get_userdata( $user_id );

    $owner_info = get_userdata( $owner_id );
    $comment = json_decode($booking_data['comment']);
    switch ( $status )
    {
        case 'waiting' :

            $mail_to_user_args = array(
                'email' => $user_info->user_email,
                'booking'  => $booking_data,
            );
            do_action('listeo_mail_to_user_waiting_approval',$mail_to_user_args);

            $mail_to_owner_args = array(
                'email'     => $owner_info->user_email,
                'booking'  => $booking_data,
            );

            do_action('listeo_mail_to_owner_new_reservation',$mail_to_owner_args);

            break;
        case 'confirmed' :

            $product_id = get_post_meta( $booking_data['listing_id'], 'product_id', true);

            $expired_after = get_post_meta( $booking_data['listing_id'], '_expired_after', true);
            if(empty($expired_after)) {
                $expired_after = 48;
            }
            if(!empty($expired_after) && $expired_after > 0){
                $expiring_date = date( "Y-m-d H:i:s", strtotime('+'.$expired_after.' hours') );
            }

            $instant_booking = get_post_meta( $booking_data['listing_id'], '_instant_booking', true);

            if($instant_booking) {

                $mail_to_user_args = array(
                    'email' => $user_info->user_email,
                    'booking'  => $booking_data,
                );
                do_action('listeo_mail_to_user_instant_approval',$mail_to_user_args);
                $mail_to_owner_args = array(
                    'email'     => $owner_info->user_email,
                    'booking'  => $booking_data,
                );
                do_action('listeo_mail_to_owner_new_intant_reservation',$mail_to_owner_args);
            }
                if ( $booking_data['price'] == 0 || $booking_data['price'] == "")
                {
                    $mail_args = array(
                        'email'     => $user_info->user_email,
                        'booking'  => $booking_data,
                    );
                    do_action('listeo_mail_to_user_free_confirmed',$mail_args);

                    break;

                }
                $first_name = (isset($comment->first_name) && !empty($comment->first_name)) ? $comment->first_name : get_user_meta( $user_id, "billing_first_name", true) ;

                $last_name = (isset($comment->last_name) && !empty($comment->last_name)) ? $comment->last_name : get_user_meta( $user_id, "billing_last_name", true) ;

                $phone = (isset($comment->phone) && !empty($comment->phone)) ? $comment->phone : get_user_meta( $user_id, "billing_phone", true) ;

                $email = (isset($comment->email) && !empty($comment->email)) ? $comment->email : get_user_meta( $user_id, "user_email", true) ;

                $billing_address_1 = (isset($comment->billing_address_1) && !empty($comment->billing_address_1)) ? $comment->billing_address_1 : '';

                $billing_city = (isset($comment->billing_city) && !empty($comment->billing_city)) ? $comment->billing_city : '';

                $billing_postcode = (isset($comment->billing_postcode) && !empty($comment->billing_postcode)) ? $comment->billing_postcode : '';

                $billing_country = (isset($comment->billing_country) && !empty($comment->billing_country)) ? $comment->billing_country : '';

                $address = array(
                    'first_name' => $first_name,
                    'last_name'  => $last_name,
                    'address_1' => $billing_address_1,
                    'city' => $billing_city,
                    'postcode'  => $billing_postcode,
                    'country'   => $billing_country,
                );

                $order = wc_create_order();

                $args['totals']['subtotal'] = $booking_data['price'];
                $args['totals']['total'] = $booking_data['price'];
                
                $comment = json_decode($booking_data['comment']);

                $order->add_product( wc_get_product( $product_id ), 1, $args );
                $order->set_address( $address, 'billing' );
                $order->set_address( $address, 'shipping' );
                $order->set_customer_id($user_id);
                $order->set_billing_email( $email );
                if(isset($expiring_date)){
                    $order->set_date_paid( strtotime( $expiring_date ) );
                }

                $payment_url = $order->get_checkout_payment_url();

                $order->calculate_totals();
                $order->save();

                $order->update_meta_data('booking_id', $booking_id);
                $order->update_meta_data('owner_id', $owner_id);
                $order->update_meta_data('listing_id', $booking_data['listing_id']);
                if(isset($comment->service)){

                    $order->update_meta_data('listeo_services', $comment->service);
                }

                $order->save_meta_data();

                $mail_args = array(
                    'email'         => $user_info->user_email,
                    'booking'       => $booking_data,
                    'expiration'    => $expiring_date,
                    'payment_url'   => $payment_url
                );

                do_action('listeo_mail_to_user_pay',$mail_args);
                $order_id =  $order->id;
                break;
        case 'paid' :
            $mail_to_owner_args = array(
                'email'     => $owner_info->user_email,
                'booking'  => $booking_data,
            );
            do_action('listeo_mail_to_owner_paid',$mail_to_owner_args);

            break;
        case 'canceled' :
        case 'cancelled' :
            $mail_to_user_args = array(
                'email'     => $user_info->user_email,
                'booking'  => $booking_data,
            );
            do_action('listeo_mail_to_user_canceled',$mail_to_user_args);

            break;
    }
}

return $order_id;

}

function wpm_products_list(){
global $wpdb;
$municipality_id = get_current_user_id_custom(get_current_user_id());
$results = $wpdb->get_results("SELECT * FROM products WHERE municipality_id=$municipality_id");
foreach( $results as $profile ){
    $products[] = $profile->Product_name;
}
$filter_products = array_unique($products);
echo '<option value="Select">Select</option>';
foreach( $filter_products as $filter_product ){
    echo '<option value="'. $filter_product .'">'. $filter_product . '</option>';
}
}

function wpm_team_list(){
global $wpdb;
$results = $wpdb->get_results("SELECT * FROM ptn_team");

foreach( $results as $team ){
    $team->name = str_replace("'", "", $team->name);
    $team->name = str_replace("/", "", $team->name);
    echo '<option value="'. $team->id .'" data-user="'. $team->user_id .'">'. $team->name . '</option>';
}
}
function add_stengt(){
global $wpdb;
$users_table = $wpdb->prefix . 'users';

$results = $wpdb->get_results("SELECT * FROM `$users_table` where user_login = 'stengt'");

if(count($results) > 0){
    $stengt_id = $results[0]->ID;
}else{
    $wpdb->insert($users_table, array(

        'user_login'            => "stengt",
        'display_name'          => "Stengt",
        'user_nicename'          => "Stengt",
        'user_registered'          => date("Y-m-d H:i:s"),
    
    ));
    $stengt_id = $wpdb->insert_id;

}  
}
function wpm_user_list($cal_type){
global $wpdb;

add_stengt();


$group_ids = get_current_user_id_custom(get_current_user_id());
$cuser_id = get_current_user_id();
$users_and_users_groups_table = $wpdb->prefix . 'users_and_users_groups';
$users_table = $wpdb->prefix . 'users';
$group_id = $value;
if($cal_type == "view_only"){
    $cal_view = get_user_meta(get_current_user_ID(),"cal_view",true); 
    if(!$cal_view){
        $cal_view = "furespurte";
    }
    wp_localize_script('custom-script','cal_view',$cal_view);
    if($cal_view == "algoritme"){
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw_algorithm';
    }elseif($cal_view == "manuelle"){
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw_approved';
    }else{
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw';
    }
    
}else{
    $booking_table = $wpdb->prefix . 'bookings_calendar';
}
$results = $wpdb->get_results(
    "SELECT * FROM $users_table WHERE ID IN (select users_id from $users_and_users_groups_table where users_groups_id IN
        (Select id from ptn_users_groups where ID IN
            (
                SELECT id FROM ptn_users_groups WHERE id IN (
                    SELECT users_groups_id FROM ptn_users_and_users_groups WHERE users_id = $cuser_id
                )
            )
        )
    ) OR ID IN(select bookings_author from $booking_table WHERE owner_id= $cuser_id ) OR  ID IN(select id from $users_table WHERE user_login = 'stengt' )"
);
foreach( $results as $user ){
    $user_list []=array($user->display_name);

    
    echo '<option value="'. $user->ID .'">'. $user->display_name . '</option>';
}

$groups = $wpdb->get_results(
    "select group_concat(users_id) as users_id, users_groups_id from $users_and_users_groups_table GROUP BY users_groups_id"
);
$group_list = [];
$listing_posts_table = $wpdb->prefix .'posts';
$group_listings = [];
$author_id = get_current_user_id();
foreach( $groups as $group ){
    $group_list [$group->users_groups_id]=explode(',',$group->users_id);
    
    $user_listingss = $wpdb->get_results("SELECT GROUP_CONCAT(DISTINCT ID) as ids FROM $listing_posts_table as p WHERE `post_type`='listing' AND users_groups_id = ".$group->users_groups_id."  AND ( `post_author` = $author_id ) group by users_groups_id"); 
    // echo "SELECT GROUP_CONCAT(DISTINCT ID) as ids FROM $listing_posts_table as p WHERE `post_type`='listing' AND users_groups_id = ".$group->users_groups_id."  AND ( `post_author` = $author_id ) group by users_groups_id";
    // echo "<pre>";print_r($user_listingss);exit;
    if(!empty($user_listingss)){
        $group_listings[$group->users_groups_id]= explode(',',$user_listingss[0]->ids);
    }
}
// exit;
wp_localize_script('custom-script','clublist',array('group_list'=>$group_list,'group_listings' =>$group_listings,'club'=>!empty($user_list) ? $user_list : [],'status'=> empty($results) ? "empty" : "data"));
}

function wpm_club_list(){
global $wpdb;
$group_ids = get_current_user_id_custom(get_current_user_id());


foreach ($group_ids as $key => $value) {
    $group_id = $value;
    $results = $wpdb->get_results("SELECT * FROM club WHERE users_groups_id=$group_id");
foreach( $results as $profile ){
    $profile_list []=array($profile->company_name);
    
    echo '<option value="'. $profile->id .'">'. $profile->company_name . '</option>';
        }

    wp_localize_script('custom-script','clublist',array('club'=>$profile_list));

}
}

// function sports_list(){
//     global $wpdb;
//     $results = $wpdb->get_results("SELECT * FROM sport");
//     foreach( $results as $profile ){
//         $sports_list []=array($profile->name);
//     }

//      wp_localize_script('custom-script','sportsList',array('sport'=>$sports_list));



function get_teams_by_client(){
global $wpdb;
$client_value = $_POST['client_value'];
$team_table ='ptn_team';
$results = $wpdb->get_results("SELECT * FROM $team_table WHERE user_id = $client_value");
$options=[];
foreach($results as $team){
    $options[] = array('id'=>$team->id , 'name'=>$team->name, 'user_id'=>$team->user_id);   
}
wp_send_json( array('options'  => $options) );
die();
exit();
}

add_action( 'wp_ajax_nopriv_get_teams_by_client', 'get_teams_by_client' );
add_action( 'wp_ajax_get_teams_by_client', 'get_teams_by_client' );

function get_booking_by_user(){
//Preloading Data
global $wpdb;

$current_language = get_locale(); 
$current_language = str_replace("_","-",$current_language); 
get_tranlation($current_language);
wp_localize_script('custom-script','current_language',$current_language);

$id = $_POST['id'];
$cal_view = "";
if(isset($_POST["cal_type"]) && $_POST["cal_type"] == "view_only"){

    $cal_view = get_user_meta(get_current_user_ID(),"cal_view",true); 
    if(!$cal_view){
        $cal_view = "furespurte";
    }
    wp_localize_script('custom-script','cal_view',$cal_view);
    if($cal_view == "algoritme"){
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw_algorithm';
    }elseif($cal_view == "manuelle"){
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw_approved';
    }else{
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw';
    }

}else{

    $booking_table = $wpdb->prefix . 'bookings_calendar';
}

$team_table  = $wpdb->prefix . 'team';
$user_table  = $wpdb->prefix . 'users';
$user_meta_table = $wpdb->prefix . 'usermeta';
$posts_table = $wpdb->prefix . 'posts';

$not_rejected_showing = get_user_meta(get_current_user_ID(),"not_rejected_showing",true); 

$user_d = get_user_by( 'id', $id ); 
if(isset($user_d->user_login) && $user_d->user_login == "stengt"){


    $stengt_sql = "And (closed_user_id = ".get_current_user_ID()." OR pst.users_groups_id = bt.closed_user_group_id)";
}else{
    $stengt_sql = "";
}


if($cal_view == "algoritme" || $cal_view == "manuelle"){

    if($not_rejected_showing == "1"){
        
        $booking_results = $wpdb->get_results("SELECT bt.*,pst.`post_title` FROM $booking_table bt 
                                        JOIN $posts_table pst ON bt.listing_id = pst.ID 
                                        WHERE bt.bookings_author = $id AND rejected !='1' $stengt_sql");
    }else{
        $booking_results = $wpdb->get_results("SELECT bt.*,pst.`post_title` FROM $booking_table bt 
                                        JOIN $posts_table pst ON bt.listing_id = pst.ID 
                                        WHERE bt.bookings_author = $id $stengt_sql");
    }
    
}else{
    $booking_results = $wpdb->get_results("SELECT bt.*,pst.`post_title` FROM $booking_table bt 
                                        JOIN $posts_table pst ON bt.listing_id = pst.ID 
                                        WHERE bt.bookings_author = $id $stengt_sql");
}





$listings        = $wpdb->get_results("SELECT * FROM $posts_table WHERE `post_type` LIKE `listing`");
$team_results   = $wpdb->get_results("SELECT * FROM $team_table");
$user_results   = $wpdb->get_results("SELECT * FROM $user_table");
$user_info      = $wpdb->get_results("SELECT * FROM $user_meta_table WHERE user_id= $id");

$team_results_user   = $wpdb->get_results("SELECT id,name,user_id FROM $team_table WHERE user_id = $id");
// User Info Arrangement
$user_info_data = [
    'nickname'      => '',
    'first_name'    => '',
    'last_name'     => '',
    'description'   => '',
    'billing_phone' => '',
    'billing_email' => '',
];
foreach($user_info as $item){
    $item->meta_key == 'nickname' ? ($user_info_data['nickname'] = $item->meta_value) : null;
    $item->meta_key == 'first_name' ? ($user_info_data['first_name'] = $item->meta_value) : null;
    $item->meta_key == 'last_name' ? ($user_info_data['last_name'] = $item->meta_value) : null;
    $item->meta_key == 'description' ? ($user_info_data['description'] = $item->meta_value) : null;
    $item->meta_key == 'billing_phone' ? ($user_info_data['billing_phone'] = $item->meta_value) : null;
    $item->meta_key == 'billing_email' ? ($user_info_data['billing_email'] = $item->meta_value) : null;
    
}

//Loading Resources of Booking Calendar
$records=[];
foreach($booking_results as $record){
    if($record->status == "pay_to_confirm"){
        continue;
    }
    $team_title =$club_name= '';

    foreach($team_results as $team){
        if($team->id == $record->team_id){
            $team_title = $team->name;
        }
    }

    foreach($user_results as $user){
        if($user->ID == $record->bookings_author){
            $user_name = $user->display_name;
        }
    };
    if($record->status == "paid" && $record->fixed == "1"){
        $record->status = "closed";
    }
    if($record->status == "paid" && $record->fixed == "2"){
        $record->status = "sesongbooking";
    }
    $org_status = $record->status;
    $status_text = "";
    if($current_language  == "nb-NO"){
        if($record->status == "paid" || $record->status == "Paid"){
            $status_text = "Betalt";
        }else if($record->status == "waiting" || $record->status == "Waiting"){
            $status_text = "Venter på godkjenning";
        }
        else if($record->status == "confirmed" || $record->status == "Confirmed"){
            $status_text = "Godkjenn";
        }
        else if($record->status == "pay_to_confirm"){
            $status_text = "Ikke gjennomført betaling";
        }
        else if($record->status == "expired" || $record->status == "Expired"){
            $status_text = "Utløpt booking";
        }
        else if($record->status == "canceled" || $record->status == "Canceled"){
            $status_text = "Kansellert";
        }
        else if($record->status == "closed" || $record->status == "Closed"){
            $status_text = "Stengt";
        }else if($record->status == "sesongbooking" || $record->status == "sesongbooking"){
            $status_text = "Sesongbooking";
        }
        else if($record->status == "unpaid" || $record->status == "Unpaid"){
            $status_text = "ubetalt";
        }
        else if($record->status == "Pending" || $record->status == "pending"){
            $status_text = "Avventer";
        }else{
            $status_text = $record->status;
        }
    }else{
        $status_text = $record->status;
    }

    $start_d = date("l H:i",strtotime($record->date_start));
    $end_d = date("l H:i",strtotime($record->date_end));
    if($current_language == "nb-NO"){
        $start_d = str_replace("Monday", "Mandag", $start_d);
        $start_d = str_replace("Tuesday", "Tirsdag", $start_d);
        $start_d = str_replace("Wednesday", "Onsdag", $start_d);
        $start_d = str_replace("Thursday", "Torsdag", $start_d);
        $start_d = str_replace("Friday", "Fredag", $start_d);
        $start_d = str_replace("Saturday", "Lørdag", $start_d);
        $start_d = str_replace("Sunday", "Søndag", $start_d);

        $end_d = str_replace("Monday", "Mandag", $end_d);
        $end_d = str_replace("Tuesday", "Tirsdag", $end_d);
        $end_d = str_replace("Wednesday", "Onsdag", $end_d);
        $end_d = str_replace("Thursday", "Torsdag", $end_d);
        $end_d = str_replace("Friday", "Fredag", $end_d);
        $end_d = str_replace("Saturday", "Lørdag", $end_d);
        $end_d = str_replace("Sunday", "Søndag", $end_d);

    }
    $show_extra_info = get_user_meta(get_current_user_ID(),"show_extra_info",true);
    


    $extra_info = "";

    if($show_extra_info != "" && $show_extra_info != "0" && $record->application_id != ""){

        $applications_db = 'applications';  // table name
        $applications_sql = "SELECT * from $applications_db where id = ".$record->application_id;
        $applications_dd = $wpdb->get_row($applications_sql);

        

        if(isset($applications_dd->age_group_id) && $applications_dd->age_group_id != "" && $show_extra_info == "age_group"){
            $age_group_db = 'age_group';  // table name
            $age_group_sql = "SELECT name from $age_group_db where id =".$applications_dd->age_group_id;
            $age_group_dd = $wpdb->get_results($age_group_sql);
            
            $age_group_names = array();

            foreach ($age_group_dd as $key => $age_group_dd_val) {
                $age_group_names[] = $age_group_dd_val->name;
            }
            $extra_info = implode(", ", $age_group_names);
        }elseif(isset($applications_dd->team_level_id) && $applications_dd->team_level_id != "" && $show_extra_info == "level"){
            $team_level_db = 'team_level';  // table name
            $team_level_sql = "SELECT name from $team_level_db where id =".$applications_dd->team_level_id;
            $team_level_dd = $wpdb->get_results($team_level_sql);

            $team_level_names = array();

            foreach ($team_level_dd as $key => $team_level_dd_val) {
                $team_level_names[] = $team_level_dd_val->name;
            }
            $extra_info = implode(", ", $team_level_names);
        }elseif(isset($applications_dd->type_id) && $applications_dd->type_id != "" && $show_extra_info == "type"){
            $type_db = 'type';  // table name
            $type_sql = "SELECT name from $type_db where id =".$applications_dd->type_id;
            $type_dd = $wpdb->get_results($type_sql);

            $type_names = array();

            foreach ($type_dd as $key => $type_dd_val) {
                $type_names[] = $type_dd_val->name;
            }
            $extra_info = implode(", ", $type_names);
        }elseif(isset($applications_dd->sport_id) && $applications_dd->sport_id != "" && $show_extra_info == "sport"){
            $sport_db = 'sport';  // table name
            $sport_sql = "SELECT name from $sport_db where id =".$applications_dd->sport_id;
            $sport_dd = $wpdb->get_results($sport_sql);

            $sport_names = array();

            foreach ($sport_dd as $key => $sport_dd_val) {
                $sport_names[] = $sport_dd_val->name;
            }
            $extra_info = implode(", ", $sport_names);
        }elseif(isset($applications_dd->members) && $applications_dd->members != "" && $show_extra_info == "members"){
            
            $extra_info = $applications_dd->members;

        }elseif(isset($applications_dd->team_id) && $applications_dd->team_id != "" && $show_extra_info == "team_name"){
            $team_db = $wpdb->prefix . 'team';  // table name
            $team_sql = "SELECT name from $team_db where id =".$applications_dd->team_id;
            $team_dd = $wpdb->get_results($team_sql);

            $team_names = array();

            foreach ($team_dd as $key => $team_dd_val) {
                $team_names[] = $team_dd_val->name;
            }
            $extra_info = implode(", ", $team_names); 
        }

        

    }

    

    $records[]=[
        'id'                  =>$record->id,
        'title'               =>$record->title,
        'end'                 =>$record->date_end,
        'start'               =>$record->date_start,
        'start_d'             =>$start_d,
        'end_d'               =>$end_d,
        'rejected'            =>$record->rejected,
        'org_status'            =>$org_status,
        'extra_info'          =>  $extra_info,
        //'pricegroup'          =>['text'=>$record->price_group, 'value'=>$record->price_group],
        // 'recurrenceException' =>'',
        // 'recurrenceRule'      =>'',
        // 'startTimezone'       =>'',
        'status'              =>['text'=>$status_text,'value'=>$record->status],
        'team'                =>['text'=>$team_title,'value'=>$record->team_id],
        'client'              =>['text'=> $user_name, 'value'=>$record->bookings_author],
        'recurrenceRule'      => $record->recurrenceRule,
        'recurring'     => $record->recurrenceRule,
        'recurrenceException' => $record->recurrenceException,
        'recurringException' => $record->recurrenceException,
        'recurrenceId'        => $record->recurrenceID,
        'gymSectionId'        => $record->listing_id,
        'post_title'          => $record->post_title
    ];
}

//Sending Back Response
wp_send_json(
    array (
        'data' => $records,
        'user_teams' => $team_results_user,
        'user_info'  => $user_info,
        'user_data'  => $user_info_data, 
    )
);

die();
exit();
}
add_action( 'wp_ajax_nopriv_get_booking_by_user', 'get_booking_by_user' );
add_action( 'wp_ajax_get_booking_by_user', 'get_booking_by_user' );

function get_booking_by_club(){
/*
global $wpdb;

$id = $_POST['id'];
$record_table = $wpdb->prefix .'bookings_calendar';//$wpdb->prefix . 'club';
$results = $wpdb->get_results("SELECT * FROM $record_table WHERE client_id = $id");

// $table[] = '<tr>';
// $table[] = '<th>Company Name</th>';
// $table[] = '<th>Address</th>';
// $table[] = '<th>ZipCode</th>';
// $table[] = '<th>Phone #</th>';
// $table[] = '<th>Email</th>';
// $table[] = '<th>Action</th>';
// $table[] = '</tr>';
    $table[] = '<tr>';
$table[] = '<th>Client</th>';
$table[] = '<th>Team</th>';
$table[] = '<th>Status</th>';
$table[] = '<th>Action</th>';
$table[] = '</tr>';
    
foreach( $results as $event ){
    $table_data[] = '<tr>';
    $table_data[] = '<td>' . $event->client_id . '</td>';
    //$table_data[] = '<td>' . substr($profile->date_start, 0, 10) . ' - ' . substr($profile->date_end, 0, 10) . '</td>';
    //$table_data[] = '<td>' . substr($profile->date_start, -8) . ' - ' . substr($profile->date_end, -8) . '</td>';
    $table_data[] = '<td>' . $event->team_id . '</td>';
    $table_data[] = '<td>' . $event->price_group . '</td>';
    $table_data[] = '<td>' . $event->status . '</td>';
    $table_data[] = '<td><a href="#'. $event->id .'"><i class="fas fa-trash-alt"></i></a></td>';
    // $table_data[] = '<td>' . $profile->company_name . '</td>';
    // //$table_data[] = '<td>' . substr($profile->date_start, 0, 10) . ' - ' . substr($profile->date_end, 0, 10) . '</td>';
    // //$table_data[] = '<td>' . substr($profile->date_start, -8) . ' - ' . substr($profile->date_end, -8) . '</td>';
    // $table_data[] = '<td>' . $profile->address . '</td>';
    // $table_data[] = '<td>' . $profile->zipcode . '</td>';
    // $table_data[] = '<td>' . $profile->phone . '</td>';
    // $table_data[] = '<td>' . $profile->email . '</td>';
    // $table_data[] = '<td><a href="#'. $profile->id .'"><i class="fas fa-trash-alt"></i></a></td>';
    $table_data[] = '</tr>';
}

wp_send_json( array( 'table' => $table, 'table_data' => $table_data ) );
exit();
*/
//Preloading Data
global $wpdb;
$id = $_POST['id'];
$booking_table = $wpdb->prefix . 'bookings_calendar';
$team_table  = 'team';
$club_table  ='club';
$booking_results = $wpdb->get_results("SELECT * FROM $booking_table WHERE client_id = $id");
$team_results   = $wpdb->get_results("SELECT * FROM $team_table");
$club_results   = $wpdb->get_results("SELECT * FROM $club_table");
//Loading Resources of Booking Calendar
$records=[];
foreach($booking_results as $record){
    if($record->status == "pay_to_confirm"){
        continue;
    }
    $team_title =$club_name= '';
    foreach($team_results as $team){
        if($team->club_id == $record->team_id){
            $team_title = $team->name;
        }            
    }
    foreach($club_results as $club){
        if($club->id == $record->client_id){
            $club_name = $club->company_name;
        }
    };
    $org_status = $record->status;
    $start_d = date("l H:i",strtotime($record->date_start));
    $end_d = date("l H:i",strtotime($record->date_end));
    if($current_language == "nb-NO"){
        $start_d = str_replace("Monday", "Mandag", $start_d);
        $start_d = str_replace("Tuesday", "Tirsdag", $start_d);
        $start_d = str_replace("Wednesday", "Onsdag", $start_d);
        $start_d = str_replace("Thursday", "Torsdag", $start_d);
        $start_d = str_replace("Friday", "Fredag", $start_d);
        $start_d = str_replace("Saturday", "Lørdag", $start_d);
        $start_d = str_replace("Sunday", "Søndag", $start_d);

        $end_d = str_replace("Monday", "Mandag", $end_d);
        $end_d = str_replace("Tuesday", "Tirsdag", $end_d);
        $end_d = str_replace("Wednesday", "Onsdag", $end_d);
        $end_d = str_replace("Thursday", "Torsdag", $end_d);
        $end_d = str_replace("Friday", "Fredag", $end_d);
        $end_d = str_replace("Saturday", "Lørdag", $end_d);
        $end_d = str_replace("Sunday", "Søndag", $end_d);

    }
    
    $records[]=[
                'id'                  =>$record->event_id,
                'title'               =>$record->title,
                'attendee'            =>1,//placeholder attendee
                'end'                 =>$record->date_end,
                'end_d'               =>$end_d,
                'start'               =>$record->date_start,
                'start_d'             =>$start_d,
                '$org_status'         =>$org_status,
                //'pricegroup'          =>['text'=>$record->price_group, 'value'=>$record->price_group],
                // 'recurrenceException' =>'',
                // 'recurrenceRule'      =>'',
                // 'startTimezone'       =>'',
                //'status'              =>['text'=>$record->status,'value'=>$record->status],
                //'team'                =>['text'=>$team_title,'value'=>$record->team_id],
                //'client'              =>['text'=> $club_name, 'value'=>$record->client_id],
                'GymID'               => $record->gym_id,
                'recurrenceRule'      => $record->recurrenceRule,
                'recurring' => $record->recurrenceRule,
                'recurrenceException' => $record->recurrenceException,
                'recurringException' => $record->recurrenceException,
                'recurrenceId'        => $record->recurrenceID,
                'gymSectionId'        => $record->gym_section_id,
                ];
}
//Sending Back Response
wp_send_json(   $records  );

die();
exit();
}
add_action( 'wp_ajax_nopriv_get_booking_by_club', 'get_booking_by_club' );
add_action( 'wp_ajax_get_booking_by_club', 'get_booking_by_club' );

function wpm_schedule_calendar_shortcode($parms){
ob_start();
$cal_type = "";
$class_type = "";
if(isset($parms["type"]) && $parms["type"] == "view_only"){
        $cal_type = "view_only";
        $class_type = "cal_view_only";
}
scheduler_tasks_to_js($cal_type);
?>

<div id="demo-recurrence-edit-mode-popup" style="display:none;">
    <div >
        <div class="mbsc-form-group-title" style="
        font-weight: 900;
        font-size: 16px;
        text-align: center;
        margin-top: 18px;
        padding-bottom: 10px;
        margin-bottom: 5px;
        border-bottom: 1px solid #b8bdc1;
        ">
            <span id="recurrence-text"></span> EDIT RECURRING EVENT
        </div>
        <input type="radio" id="recurrence-current" name="recurrence-mode" value="current" style="display:inline-block;" checked = "checked">
        <label for="recurrence-current" style="display:inline-block;">This event only</label><br>
        <input type="radio" id="recurrence-following" name="recurrence-mode" value="following" style="display:inline-block;">
        <label for="recurrence-following" style="display:inline-block;">This and following events</label><br>
        <input type="radio" id="recurrence-all" name="recurrence-mode" value="all" style="display:inline-block;">
        <label for="recurrence-all" style="display:inline-block;">All events</label>
    </div>
</div>
<div class="modal fade" id="theModal" tabindex="-1" role="dialog" aria-labelledby="theModalLabel" aria-hidden="true">
    <div style="background: #000;position: absolute;height: 100%;width:  100%;opacity: .5;"></div>
    <div class="modal-dialog" role="document"
        style="position: fixed !important;left: 50% !important;top: 50% !important;transform: translate(-50%, -50%) !important;max-width: 600px">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Rediger gjentagende oppgave</h5>
                <button type="button" class="close" id="modal-dismiss" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="my-5 text-center">Do you want to edit only this instance or all instances of this task?</p>
            </div>
            <div class="modal-footer">
                <button type="button" id="this-instance" class="btn.calendar.popup">Edit this instance</button>
                <button type="button" id="all-instance" class="btn.calendar.popup">Edit all instances</button>
            </div>
        </div>
    </div>
</div>
<div class="col-md-12 wpm-content <?php echo $class_type;?>">
    <div id="example" class="k-content">
        <span id="popupNotification"></span>
        <div id="loader" class="loader-box-services"></div>
        <div id="toast-container" class="bottom-right"></div>
        <div id="calendar-event-tooltip-popup" class="md-tooltip">
        </div>

        <div id="scheduler" style="height:100%;" class="fc fc-media-screen fc-direction-ltr fc-theme-standard"></div>
        <div class="error-msg listing-error"
            style="display:none;color: red;text-align: center;font-size: 1.5em;position: absolute;top: 150px;left: 35%;">
            Please select a filter to see calendar in this view</div>
        <div class="error-msg listing-error1"
            style="display:none;color: red;text-align: center;font-size: 1.5em;position: absolute;top: 150px;left: 35%;">
            please only select 1 filter for this view</div>
    </div>
</div>
<span id="notification"></span>
<style type="text/css">
    .show-info {
        cursor: pointer;
    }

    /******** Event Color Change *******/
    #scheduler .calendar-status-confirmed {
        background-color: #61B2DB;
        border: 1px solid #61B2DB;
    }

    #scheduler .calendar-status-canceled {
        background-color: #EE3535;
        border: 1px solid #EE3535;
    }

    #scheduler .calendar-status-expired {
        background-color: #EE3535;
        border: 1px solid #EE3535;
    }

    #scheduler .calendar-status-waiting {
        background-color: #FF8312;
        border: 1px solid #FF8312;
    }

    #scheduler .calendar-status-pay_to_confirm {
        background-color: #FF8312;
        border: 1px solid #FF8312;
    }

    #scheduler .calendar-status-paid {
        background-color: #3B940B;
        border: 1px solid #3B940B;
    }

    #scheduler .calendar-status-sesongbooking {
        background: #006DA5;
        border: 1px solid #006DA5;
    }

    #scheduler .calendar-status-done {
        background: #FE862c;
        border: 1px solid #FE862c;
    }

    #scheduler .calendar-status-algo_done {
        background: #63B1D9;
        border: 1px solid #63B1D9;
    }

    #scheduler .calendar-status-rejected {
        background: #F13C30;
        border: 1px solid #F13C30;
    }

    #scheduler .calendar-status-rejected_modified {
        background: #A80A00;
        border: 1px solid #A80A00;
    }

    #scheduler .calendar-status-rejected_notmodified {
        background: #F13C30;
        border: 1px solid #F13C30;
    }

    #scheduler .calendar-status-notrejected_modified {
        background: #086CA3;
        border: 1px solid #086CA3;
    }

    #scheduler .calendar-status-notrejected_notmodified {
        background: #65B0D6;
        border: 1px solid #65B0D6;
    }

    #scheduler .k-event {
        border: none !important;
    }

    .calendar-status-closed,
    .calendar-status-Lukket {
        background: #C0C0C0 !important;
        border: 1px solid #C0C0C0;
    }

    /******** Event Color Change *******/
    .erreur {
        background-color: #fff;
        border: 1px solid #5ed192;
    }

    .loader-box-services {
        font-size: 30px;
        padding: 1em;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
    }

    button {
        display: inline-block;
        border: 2px solid;
        color: #7E8199;
        padding: 0.5em 1em;
        border-radius: 5px;
        border-color: white;

    }

    button:hover {
        display: inline-block;
        background-color: #008474;
        color: #ffffff;
        padding: 0.5em 1em;
        border-radius: 5px;
        border-color: white;

    }

    [class*=loader-] {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #008474;
        vertical-align: middle;
        pointer-events: none;
    }

    .loader-14 {
        border-radius: 50%;
        box-shadow: 0 1em 0 -0.2em currentcolor;
        position: relative;
        animation: loader-14 0.8s ease-in-out alternate infinite;
        animation-delay: 0.32s;
        top: -1em;
    }

    .loader-14:after,
    .loader-14:before {
        content: "";
        position: absolute;
        width: inherit;
        height: inherit;
        border-radius: inherit;
        box-shadow: inherit;
        animation: inherit;
    }

    .loader-14:before {
        left: -1em;
        animation-delay: 0.48s;
    }

    .loader-14:after {
        right: -1em;
        animation-delay: 0.16s;
    }

    @keyframes loader-14 {
        0% {
            box-shadow: 0 2em 0 -0.2em;
        }

        100% {
            box-shadow: 0 1em 0 -0.2em;
        }
    }

    .box:nth-of-type(n + 43) {
        display: none;
    }

    .out-screen {
        transform: translateX(100%);
    }

    .bottom-right {
        position: fixed;
        bottom: 1rem;
        right: 0rem;
        z-index: 99999;
    }

    .centered {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #toast-container {
        display: flex;
        flex-direction: column-reverse;
    }

    .toast {
        transition: 0.5s;
        color: #fff;
        padding: 2rem;
        position: relative;
        margin-top: 0.5rem;
        border-radius: 1rem;
        max-width: 40rem;
        background-color: #10c15c;
    }

    /* .toast::before {
transition: 0.5s;
content: "\00D7";
font: 2rem bold;
position: absolute;
top: 1.5rem;
right: 1rem;
transform: translate(-50%, -50%);
color: white;
} */

    .toast:hover::before {
        transform: translate(-50%, -50%) scale(1.5);
    }

    .toast-entrance {
        animation-name: toast-entrance;
        animation-duration: 1s;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        transform-origin: top center;
    }

    @keyframes toast-entrance {
        0% {
            transform: translateY(100%);
            right: 0rem;
        }

        /*  15% {
    transform: translateY(-50%);
}

30% {
    transform: translateY(0);
}

45% {
    transform: scale(0.8, 1.2);
} */

        50% {
            transform: scale(1, 0.8);
        }

        /*  65% {
    transform: translateY(-1rem) scale(1.2, 0.8);
}

70% {
    transform: translateY(0) scale(1.2, 0.8);
    right: 0rem;
}

75% {
    transform: scale(1, 1);
}

80% {
    transform: scale(0.9, 1.1);
} */

        85% {
            transform: scale(1, 1);
        }
    }

    .fc .fc-bg-event {
        background: #c0c0c0 !important;
    }

    .fc .fc-non-business {
        background: rgba(229, 229, 229, 0.8);
    }

    .fc .alert-success {
        color: #54ce8c;
        background-color: #e8fff3;
        border: 1px solid #54ce8c;
    }

    .alert {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid #54ce8c;
        border-radius: 4px;
    }

    button.close {
        -webkit-appearance: none;
        padding: 0;
        cursor: pointer;
        background: 0 0;
        border: 0;
    }

    .close {
        float: right;
        font-size: 21px;
        font-weight: 700;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        filter: alpha(opacity=20);
        opacity: .2;
    }

    .k-scheduler-toolbar .k-scheduler-views-wrapper .k-views-dropdown {
        width: 100%;
        display: block !important;
        padding: 0px 15px !important;
        height: 32px !important;
        margin-bottom: 0 !important;
        -webkit-appearance: auto !important;
    }

    .k-scheduler-toolbar .k-scheduler-views-wrapper .k-scheduler-views {
        display: none !important;
    }

    .cal_view_only .k-scheduler-update,
    .cal_view_only .k-scheduler-delete {
        display: none !important
    }

    .k-event-delete {
        color: #FFFFFF;
        display: inline;
    }

    .k-event-delete-show {
        display: inline-flex;
    }

    #clear-filter {
        position: absolute;
        right: 50px;
        top: 14px;
        cursor: pointer;
    }
</style>
<?php 
$cal_view = get_user_meta(get_current_user_ID(),"cal_view",true); 
if($cal_type == "view_only" && $cal_view != "manuelle"){  ?>
<style type="text/css">
    .k-event:hover .k-resize-handle,
    .k-event-active .k-resize-handle,
    .k-scheduler-mobile .k-event-active:hover .k-resize-handle {
        /* Hides the resize icons on events */
        visibility: hidden;
    }
</style>
<?php } ?>
<?php if($cal_type == "view_only"){ ?>
<style type="text/css">
    .k-scheduler-update,
    .k-scheduler-delete,
    .k-scheduler-navigation,
    .k-nav-current {
        display: none !important
    }
</style>

<?php } ?>
<?php 

if($cal_view == "manuelle"){ ?>
<style type="text/css">
    .k-scheduler-update {
        display: inline-block !important
    }
</style>

<?php } ?>
<?php
wpm_schedule_calendar_popup($cal_type);
return ob_get_clean();
}

add_shortcode( 'schedule-calendar', 'wpm_schedule_calendar_shortcode' );

function wpm_schedule_calendar_popup($cal_type){
$current_language = get_locale(); 
$current_language = str_replace("_","-",$current_language); 
$translations = get_tranlation($current_language);    
?>
<style>
    .k-toolbar,
    .k-scheduler-layout {
        display: none;
    }

    .k-edit-form-container {
        width: 100% !important;
        min-width: 1200px !important;
    }

    .content-box {
        min-width: 725px;
        float: left;
        box-sizing: border-box;
        padding-left: 15px;
        padding-right: 15px;
    }

    .content-box .sec-tab {
        width: 33.33333%;
        float: left;
        box-sizing: border-box;
        padding: 15px;
        font-weight: 600;
        color: #008474;
        cursor: pointer;
    }

    .content-box .sec-tab.wpm-active {
        border-bottom: 3px solid #008474;
    }

    .data-table {
        width: 100%;
        float: left;
        margin-top: 10px;
    }

    .data-table table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    .data-table table td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    .data-table table tr:nth-child(even) {
        background-color: #dddddd;
    }

    .sidebar table {
        width: 100%;
        margin-top: 10px;
    }

    .sidebar table tr {
        width: 100%;
        height: 40px;
    }

    .sidebar table tr input,
    input[type="text"] {
        height: auto !important;
    }

    .sidebar table tr input[type='radio'] {
        height: 13px !important;
    }

    .sidebar table tr textarea {
        padding: 10px !important;
        width: 93% !important;
        min-width: 85% !important;
    }

    .weekly-tabs {
        display: none;
    }

    #wpm-client {
        opacity: 1 !important;
        width: auto;
    }
</style>
<?php
    $cal_view = get_user_meta(get_current_user_ID(),"cal_view",true); 
?>

<div class="modal" id="schedule-add" style="display:none;">
    <div class="modal-dialog" style="width:80%;">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Event</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="template-container">
					<?php echo do_shortcode("[booking-management-gibbs-v2 mode='modal']"); ?>
                    <div class="tab-1 data-table" id="editorInnerTab" style="display:none;">

                        <div class="newPopupSt">
                            <div class="sidebars">

                                <div class="fbox">
                                    <div class="fbox__items">
                                        <div class="data-value mr-15">
                                            <label class="title">
                                                <?php if($cal_type == "view_only"){
                                                echo __("Søker","Gibbs");
                                            }else{
                                                echo $translations["Client"];
                                            }
                                        ?>
                                                <b class="addMore">+</b>
                                            </label>
                                            <input type="hidden" name="wpm-resourceId" id="wpm-resourceId" />
                                            <input type="hidden" name="wpm-repeat" id="wpm-repeat" value="0" />
                                            <input type="hidden" name="wpm-rrule" id="wpm-rrule" />
                                            <input type="hidden" name="wpm-recurrenceId" id="wpm-recurrenceId" />
                                            <input type="hidden" name="wpm-recurrenceException"
                                                id="wpm-recurrenceException" />
                                            <input type="hidden" name="wpm-initial-date" id="wpm-initial-date" />
                                            <input type="hidden" name="wpm-eventId" id="wpm-eventId" />
                                            <select name="client" data-bind="value:client" title="Club list"
                                                data-role="dropdownlist" data-filter="contains" class="k-valid"
                                                id="wpm-client" required
                                                validationMessage="<?php echo __("Kunde er obligatorisk","Gibbs");?>">
                                                <option value="">Select</option>
                                                <?php wpm_user_list($cal_type); ?>
                                                <?php //wpm_club_list(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <?php if($cal_type != "view_only"){?>
                                    <div class="fbox__items">
                                        <div class="data-value ml-15">
                                            <label class="title">
                                                <?php echo $translations["Team"];?>
                                            </label>
                                            <select name="team" data-bind="value:team" title="Team list"
                                                data-role="dropdownlist" class="k-valid" id="wpm-team">
                                                <?php //wpm_team_list(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <?php } ?>
                                </div>
                                <div class="fbox">
                                    <div class="fbox__items fbox__itemsDate">
                                        <div class="data-value mr-15">
                                            <label class="title">
                                                Start date
                                            </label>
                                            <?php if($cal_type == "view_only"){?>
                                            <input class="" type="date"
                                                placeholder="<?php echo date('d/m/Y');?> 8:00 AM" id="wpm-date-start"
                                                name="start" re='remove' readonly />
                                            <?php }else{ ?>
                                            <input class="" style="height:30px;background-color:#efefef" type="date"
                                                placeholder="<?php echo date('d/m/Y');?> 8:30 AM" id="wpm-date-start"
                                                data-role="datetimepicker" name="start" re='remove' />
                                            <?php } ?>
                                        </div>

                                        <div class='data-value'>
                                            <label class="title">Time</label>
                                            <input style="height:30px;background-color:#efefef"
                                                data-role="datetimepicker" id="wpm-time-start" name="end" type="time"
                                                re='remove' />
                                        </div>

                                    </div>
                                    <div class="fbox__items fbox__itemsDate">
                                        <div class="data-value mr-15">
                                            <label class="title">
                                                End date
                                            </label>
                                            <?php if($cal_type == "view_only"){?>
                                            <div class='data-value'>
                                                <input type="text" name="end" id="wpm-date-end" type="date" re='remove'
                                                    readonly />
                                            </div>
                                            <?php }else{ ?>
                                            <div class='data-value'>
                                                <input style="height:30px;background-color:#efefef"
                                                    data-role="datetimepicker" id="wpm-date-end" name="end" type="date"
                                                    re='remove' />
                                            </div>
                                            <?php } ?>
                                        </div>

                                        <div class='data-value'>
                                            <label class="title">Time</label>
                                            <input style="height:30px;background-color:#efefef"
                                                data-role="datetimepicker" id="wpm-time-end" name="end" type="time"
                                                re='remove' />
                                        </div>

                                    </div>
                                </div>
                                <?php if($cal_type != "view_only"){?>
                                <div class="fbox__items">
                                    <div class="data-value">
                                        <div class="d-flexout">
                                            <label class="title">
                                                <?php echo $translations["Repeat"];?><i class="fa fa-question-circle"
                                                    aria-hidden="true"></i>
                                            </label>
                                            <div class="width-full-small">
                                                <div class="button r" id="button-1" style="padding:3px;">
                                                    <input type="checkbox" class="checkbox" name="repeat_selection"
                                                        id="repeat_selection">
                                                    <div class="knobs"></div>
                                                    <div class="layer"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eventPop">
                                            <div class="k-recur-view">
                                                <div class="recurInner">
                                                    <div class="popHeader">Repeat <span class="closeButton">×</span>
                                                    </div>
                                                    <div class="mainInner">
                                                        <div>
                                                            <label>Gjenta på</label>
                                                            <div class="k-button-group-stretched k-recur-weekday-buttons k-widget k-button-group mainSelect"
                                                                title="Gjenta på:" data-role="buttongroup" role="group"
                                                                tabindex="0">
                                                                <span data-value="MO" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: mandag" aria-pressed="false"
                                                                    role="button" class="k-button">man.</span>
                                                                <span data-value="TU" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: tirsdag" aria-pressed="false"
                                                                    role="button" class="k-button">tir.</span>
                                                                <span data-value="WE" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: onsdag" aria-pressed="false"
                                                                    role="button" class="k-button">ons.</span>
                                                                <span data-value="TH" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: torsdag" aria-pressed="true"
                                                                    role="button" class="k-button">tor.</span>
                                                                <span data-value="FR" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: fredag" aria-pressed="false"
                                                                    role="button" class="k-button">fre.</span>
                                                                <span data-value="SA" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: lørdag" aria-pressed="false"
                                                                    role="button" class="k-button">lør.</span>
                                                                <span data-value="SU" onclick="selectClass(event)"
                                                                    aria-label="Gjenta på: søndag" aria-pressed="false"
                                                                    role="button" class="k-button">søn.</span>
                                                            </div>
                                                        </div>
                                                        <!-- <div>
                                            <label>Repeat Type</label>
                                        <select class="k-valid" id="repeat-type">
                                            <option value="daily">daily</option>
                                            <option value="weekly">weekly</option>
                                            <option value="monthly">monthly</option>
                                            <option value="yearly">yearly</option>
                                        </select>
                                        </div> -->
                                                        <div class="fbox">
                                                            <div class="fbox__items">
                                                                <div class="data-value mr-15">
                                                                    <div class="d-flex-oin">
                                                                        <label>End repeating on</label>
                                                                    </div>
                                                                    <div class='data-value'>
                                                                        <input style="padding:0px 5px;"
                                                                            class="k-recur-until k-input" title="On"
                                                                            name="wpm_until" id="wpm_until"
                                                                            data-validdate-msg="På is not valid date"
                                                                            data-untildatecompare-msg="End date should be greater than or equal to the start date"
                                                                            data-role="datepicker" type="date"
                                                                            role="combobox" aria-expanded="false"
                                                                            aria-haspopup="grid" autocomplete="off"
                                                                            aria-disabled="false" aria-readonly="false">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="fbox__items">
                                                                <div class="data-value ml-15">
                                                                    <label class="title">
                                                                        Repeat Interval(s)
                                                                    </label>
                                                                    <div class='data-value'>
                                                                        <select class="k-valid" id="repeat-interval">
                                                                            <option value="1">1</option>
                                                                            <option value="2">2</option>
                                                                            <option value="3">3</option>
                                                                            <option value="4">4</option>
                                                                            <option value="5">5</option>
                                                                            <option value="6">6</option>
                                                                            <option value="7">7</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="footerPop">
                                                            <button type="button"
                                                                class="btn btn-default">Cancel</button>
                                                            <button type="button"
                                                                class="btn btn-my-success save-recurrence">Save</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="fbox__items status_div ">
                                    <div class="data-value">
                                        <input type="text" class="k-valid status-recurrence"
                                             style="display: none;">
                                    </div>
                                </div>



                                <div class="fbox__items status_div">
                                    <div class="data-value">
                                        <label class="title">
                                            Status
                                        </label>
                                        <select name="status" id="wpm-status" title="Status" data-role="dropdownlist"
                                            class="k-valid status_booking" required
                                            validationMessage="<?php echo __("Status er obligatorisk","Gibbs");?>">
                                            <?php if(status.value == "expired"){?>
                                            <option value='expired'>Utløpt</option>
                                            <?php }else if(status.value == "canceled"){ ?>
                                            <option value='canceled'>Kansellert</option>
                                            <?php }else if(status.value == "closed"){ ?>
                                            <option value='closed'>Stengt</option>
                                            <?php }else if(status.value == "waiting"){?>
                                            <option value='waiting'>Venter på godkjenning</option>
                                            <option value='confirmed'>Godkjent</option>
                                            <option value='canceled'>Kansellert</option>
                                            <?php }else if(status.value == "confirmed"){?>
                                            <option value='confirmed'>Godkjent</option>
                                            <option value='paid'>Betalt(Sender ikke epost)</option>
                                            <option value='canceled'>Kansellert</option>
                                            <?php } else if(status.value == "paid"){ ?>
                                            <option value='paid'>Betalt</option>
                                            <option value='canceled'>Kansellert</option>
                                            <?php }else if(status.value == "sesongbooking"){?>
                                            <option value='sesongbooking'>Sesongbooking</option>
                                            <option value='canceled'>Kansellert</option>
                                            <?php }else{?>
                                            <option value='waiting'>Reservasjon (Sender ikke epost)</option>
                                            <option value='paid'>Betalt(Sender ikke epost)</option>
                                            <option value='closed'>Stengt</option>
                                            <?php } ?>
                                        </select>
                                    </div>
                                </div>
                                <?php } ?>
                                <?php if($cal_type == "view_only" && $cal_view=="manuelle"){?>
                                <div class="fbox__items">
                                    <div class="data-value">
                                        <label class="title">
                                            Status
                                        </label>
                                        <select name="status_manuale" title="Status" data-role="dropdownlist"
                                            class="k-valid">
                                            <option value='1'>Avslått</option>
                                            <option value='0'>Godkjent</option>
                                        </select>
                                    </div>
                                </div>
                                <?php } ?>

                                <div class="fbox__items">
                                    <label>Comment</label>
                                    <textarea class="" rows="4"></textarea>
                                </div>
                            </div>

                            <div class="sidebar2">
                                <div>
                                    <div class="fbox__items">
                                        <div class="data-value mr-15">
                                            <label class="title">
                                                Listing
                                            </label>
                                            <input type="text" id="wpm_listing" placeholder="Listing name" disabled>
                                        </div>
                                    </div>
                                    <div class="fbox__items">
                                        <div class="data-value ml-15">
                                            <label class="title">
                                                Sub listing <i class="fa fa-question-circle" aria-hidden="true"></i>
                                            </label>
                                            <div class="data-value">
                                                <select name="team" data-bind="seklect" title="Team list"
                                                    data-role="dropdownlist" class="k-valid" id="wpm-select2" readonly>
                                                    <option>select one</option>
                                                    <option>select two</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fbox__items">
                                        <div class="data-value mr-15">
                                            <label class="title">
                                                Notes <i class="fa fa-question-circle" aria-hidden="true"></i>
                                            </label>
                                            <textarea name="" id="" cols="30" rows="10"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-default cancel-event">Cancel</button>
                                <button type="button" class="btn btn-my-success save-event">Save</button>

                            </div>

                        </div>
                        <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-default cancel-event">Cancel</button>
                    <button type="button" class="btn btn-my-success save-event">Save</button>
                </div> -->
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>


<script id="groupHeaderTemplate" type="text/x-kendo-template">
    <strong class="tooltip" full_title="#=full_text# <br>#=sports#" style="cursor: pointer;">#=text#</strong>
    </script>
<script id='event-template-non-login' type="text/x-kendo-template">
    <div class="movie-template calendar-status-#:satus.value #">
            <p>#:"" #</p>
        </div>
    </script>
<script id="event-template" type="text/x-kendo-template">
    <div class="movie-template calendar-status-#:status.value #">
            #if( client.text != undefined){#    
                <p>
                    #:client.text #
                    #if(description !="" && description != null){#
                    <i class="far fa-comment"></i>
                    #}#
                    #if(extra_info != undefined && extra_info !="" && extra_info != null){#
                    (#:extra_info#)
                    #}#
                </p>
            #}else{#  
            <p><?php echo $translations["No Title"];?></p> 
            #}#
        </div>
    </script>
<?php
}

function wpm_schedule_calendar_data(){ 
$current_language = get_locale(); 
$current_language = str_replace("_","-",$current_language); 
$translations = get_tranlation($current_language);    
?>
<style>
    .fbox {
        display: flex;
    }

    .fbox__item {
        flex: 1;
        display: flex;
    }

    .fbox__item .title {
        width: 65px;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .fbox__item .data-value {
        flex-grow: 1;
    }

    .fbox__item .data-value textarea {
        padding: 10px !important;
    }

    .wpm-header {
        height: 100vh;
        background-color: #000000;
    }

    .wpm-header ul {
        padding: 0px;
        margin: 0px;
        margin-top: 15px;
    }

    .wpm-header ul li {
        list-style-type: none;
    }

    .wpm-header ul li a {
        padding-top: 5px;
        padding-bottom: 5px;
        display: block;
        color: #FFFFFF;
        text-decoration: none;
    }

    .wpm-header ul li a:hover {
        color: #0056b3;
    }

    .wpm-content {
        padding-top: 15px;
        background-color: #eceaea;
    }

    .k-edit-buttons {
        width: 98% !important;
        min-width: 1179px !important;
    }

    input[title="Recurrence editor"].k-button-group-stretched.k-widget.k-button-group {
        display: block;
    }
</style>
<script id="templatez" type="text/x-kendo-template">
    #var uid = target.attr("data-uid");#
#var scheduler = target.closest("[data-role=scheduler]").data("kendoScheduler");#
#var model = scheduler.occurrenceByUid(uid);console.log(model)#
#if(model) {#
    <p class="tooltip-time">#=kendo.format('{0:t}',model.start)#
    - #=kendo.format('{0:t}',model.end)#</p>
    <p class="tooltip-custom">  
    #if( model.client.text != undefined){#    
        #=model.client.text#
        #if( model.description !="" && model.description != null){#
            <p><?php echo __("Comment","Gibbs");?>: #=model.description#</p>
        #}#
        #if(model.extra_info != undefined && model.extra_info !="" && model.extra_info != null){#
            (#=model.extra_info#)
        #}#
        #if(model.org_data != undefined && model.org_data !="" && model.org_data != null && model.org_data.name != undefined && model.org_data.name != ""){#
            <hr>
            <p>Original booking</p>
            <p style="text-align:left;line-height:13px">Sted: #=model.org_data.name# </p>
            <p style="text-align:left;line-height:13px">Day: #=model.org_data.day# </p>
            <p style="text-align:left;line-height:13px">Time: #=model.org_data.time# </p>
            #if(model.app_data != undefined && model.app_data !="" && model.app_data != null){#
                <hr>
                <p style="line-height:20px">Sum desired hours: <br> #=model.app_data.sum_desired_hours#</p>
                <p style="line-height:20px">Sum algorithm hours: <br> #=model.app_data.sum_algo_hours#</p>
                <p style="line-height:20px">Sum received hours: <br> #=model.app_data.sum_received_hours#</p>
                <p style="line-height:20px">Score: <br> #=model.app_data.score#</p>
            #}#
        #}#

    #}else{#  
        <?php echo $translations["No Title"];?>
        #if(  model.description != undefined && model.description !="" && model.description != null){#
            <p><?php echo __("Comment","Gibbs");?>: #=model.description#</p>
        #}#
    #}#
    <p>
#}#
</script>
<script>
    schedulerTasks = [];
    //DONT REMOVE CALENDER WILL NOT WORK
</script>
<?php
}
add_action( 'wp_footer', 'wpm_schedule_calendar_data' );
// Loading THe Events From Database
function scheduler_tasks_to_js($cal_type){
global $wpdb;
$cal_view = "";
$not_rejected_showing = "0";

$get_ajax_data = 0;

$ajax_data = array();

if(is_array($cal_type)){
    $get_ajax_data = 1;
    if($cal_type["cal_type"] != ""){
        $cal_type = $cal_type["cal_type"];
    }else{
        $cal_type = "";
    }
    
}
if($cal_type == "view_only"){
    $cal_view = get_user_meta(get_current_user_ID(),"cal_view",true); 
    if(!$cal_view){
        $cal_view = "furespurte";
    }
    wp_localize_script('custom-script','cal_view',$cal_view);

    if($cal_view == "algoritme"){
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw_algorithm';
    }elseif($cal_view == "manuelle"){
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw_approved';
    }else{
        $booking_table = $wpdb->prefix . 'bookings_calendar_raw';
    }
    
}else{
    wp_localize_script('custom-script','cal_view',"");
    $booking_table = $wpdb->prefix . 'bookings_calendar';
}

$ajax_data["cal_view"] = $cal_view;

$users_table =$wpdb->prefix .'users';
$users_and_users_groups_table = $wpdb->prefix . 'ptn_users_and_users_groups';
$team_table  = 'team';
$club_table  ='club';
$gym_table   = 'gym';
$gym_section_table = 'gym_section';
$listing_posts_table = $wpdb->prefix .'posts';
$sport_table   = 'sport';
$author_id = get_current_user_id();

$current_language = get_locale(); 
$current_language = str_replace("_","-",$current_language); 
get_tranlation($current_language);
wp_localize_script('custom-script','current_language',$current_language);
wp_localize_script('custom-script','cal_type',$cal_type);

$ajax_data["current_language"] = $current_language;
$ajax_data["cal_type"] = $cal_type;


// settings options
$cal_starttime = get_user_meta(get_current_user_ID(),"cal_starttime",true);
$cal_endtime = get_user_meta(get_current_user_ID(),"cal_endtime",true);
$show_full_day = get_option("show_full_day");
$cell_width = get_user_meta(get_current_user_ID(),"cell_width",true);
$filter_location = get_user_meta(get_current_user_ID(),"filter_location");
$filter_group = get_user_meta(get_current_user_ID(),"filter_group");
$filter_search = get_user_meta(get_current_user_ID(),"filter_search");
$calendar_view = get_user_meta(get_current_user_ID(),"calendar_view");

wp_localize_script('custom-script','cal_starttime',$cal_starttime);
wp_localize_script('custom-script','cal_endtime',$cal_endtime);
wp_localize_script('custom-script','show_full_day',$show_full_day);
wp_localize_script('custom-script','cell_width',$cell_width);
wp_localize_script('custom-script','filter_location',$filter_location); 
wp_localize_script('custom-script','filter_search',$filter_search); 
wp_localize_script('custom-script','filter_group',$filter_group); 
wp_localize_script('custom-script','calendar_view',$calendar_view);




$ajax_data["cal_starttime"] = $cal_starttime;
$ajax_data["cal_endtime"] = $cal_endtime;
$ajax_data["show_full_day"] = $show_full_day;
$ajax_data["cell_width"] = $cell_width;
$ajax_data["filter_location"] = $filter_location;
$ajax_data["filter_search"] = $filter_search;
$ajax_data["filter_group"] = $filter_group;
$ajax_data["calendar_view"] = $calendar_view;

// end settings options
// for faster load whilve developing
//$author_id = 2;
$current_user_id = get_current_user_ID();
$users_and_users_groups = $wpdb->prefix . 'users_and_users_groups';  // table name
$users_groups = $wpdb->prefix . 'users_groups';  // table name
$users_sql = "SELECT users_groups_id from `$users_and_users_groups` where users_id = '$current_user_id'";
$user_group_data = $wpdb->get_results($users_sql);

$users1_sql = "SELECT users_groups_id, name as group_name from `$users_and_users_groups` uug JOIN `$users_groups`ug ON uug.users_groups_id = ug.id where users_id = '$current_user_id'";
$user1_group_data = $wpdb->get_results($users1_sql);

wp_localize_script('custom-script','user_group_data',json_encode($user1_group_data));
$users_groups_ids = array();

foreach ($user_group_data as $key => $gr_id) {
            $users_groups_ids[] = $gr_id->users_groups_id;
}



if($cal_type == "view_only"){

    
    $users_groups_ids = implode(",", $users_groups_ids);
    $seasons_sql = "SELECT id, name from seasons where users_groups_id in ($users_groups_ids)";
    $seasons_data = $wpdb->get_results($seasons_sql);

    wp_localize_script('custom-script','seasons_data',json_encode($seasons_data));
    $ajax_data["seasons_data"] = $seasons_data;
    

    $selected_season = get_user_meta(get_current_user_ID(),"selected_season",true); 
    if(!$selected_season && !empty($seasons_data)){

        $selected_season = $seasons_data[0]->id;

    }
    wp_localize_script('custom-script','selected_season',$selected_season);
    $ajax_data["selected_season"] = $selected_season;
    $applications_sql = "SELECT id from applications where season_id = '$selected_season'";
    $applications_data = $wpdb->get_results($applications_sql);
    $app_ids = array();
    foreach ($applications_data as  $applications_d) {
        $app_ids[] = $applications_d->id;
    }
    $app_ids = implode(",", $app_ids);
    $not_rejected_showing = get_user_meta(get_current_user_ID(),"not_rejected_showing",true); 
    if($cal_view == "algoritme" || $cal_view == "manuelle"){

        if($not_rejected_showing == "1"){
            $booking_results = $wpdb->get_results("SELECT * FROM $booking_table where application_id in ($app_ids) AND rejected !='1'");
        }else{
            $booking_results = $wpdb->get_results("SELECT * FROM $booking_table where application_id in ($app_ids)");
        }
        
    }else{
        $booking_results = $wpdb->get_results("SELECT * FROM $booking_table where application_id in ($app_ids)");
    }

    if($selected_season != ""){
        $seasons_sql1 = "SELECT * from seasons where id = $selected_season";
        $seasons_data1 = $wpdb->get_row($seasons_sql1);
        if($seasons_data1){
            $start_end_season = array("season_start"=>$seasons_data1->season_start,"season_end"=>$seasons_data1->season_end);
            // echo "<pre>"; print_r($start_end_season);
            wp_localize_script('custom-script','start_end_season',json_encode($start_end_season));
            $ajax_data["start_end_season"] = $start_end_season;
        }else{
            wp_localize_script('custom-script','start_end_season',json_encode(array()));
            $ajax_data["start_end_season"] = array();
        }

    }else{
        wp_localize_script('custom-script','start_end_season',json_encode(array()));
        $ajax_data["start_end_season"] = array();
    }
    

    


}else{
    wp_localize_script('custom-script','seasons_data',json_encode(array()));
    wp_localize_script('custom-script','start_end_season',json_encode(array()));
    $ajax_data["seasons_data"] =array();
    $ajax_data["start_end_season"] = array();
    $booking_results = $wpdb->get_results("SELECT * FROM $booking_table");
}

//echo "<pre>"; print_r($booking_results); die;



wp_localize_script('custom-script','not_rejected_showing',$not_rejected_showing);
$ajax_data["not_rejected_showing"] = $not_rejected_showing;


$team_results   = $wpdb->get_results("SELECT * FROM $team_table");
$club_results   = $wpdb->get_results("SELECT * FROM $club_table");
$user_results   = $wpdb->get_results("SELECT * FROM $users_table");
$filter_location = $wpdb->get_results("SELECT * FROM  $gym_table"); 
$spotrs_filter  = $wpdb->get_results("SELECT * FROM  $sport_table");
$working_hours = $wpdb->get_results("SELECT working_hours FROM gym_section");
$filter_sports_id = $wpdb->get_results("SELECT * FROM gym_listings_sports");
$user_groups_id = $wpdb->get_results("SELECT `users_groups_id` FROM `ptn_users_and_users_groups` WHERE users_id=$author_id;");
    $gyms_sections_check   = $wpdb->get_results("SELECT * from $gym_section_table");
$get_id = $wpdb->get_row("SHOW TABLE STATUS LIKE '$booking_table'"); 
$bc_schema_id = $get_id->Auto_increment;
if(empty($user_groups_id)){//user is related to no users_group 
    $inUserGroupsSQL = "";
}else{
    foreach($user_groups_id as $item){
        $user_groups_id_arr[]=$item->users_groups_id;
    }
    $inUserGroupsSQL = " OR users_groups_id IN (". implode(',',(array)$user_groups_id_arr) .") ";
}


    $users_groups_ids = implode(",", $users_groups_ids);
    $users_and_users_groups_table = $wpdb->prefix . 'users_and_users_groups';
        $sqlll = "select * from $users_and_users_groups_table where users_id =".get_current_user_ID();
    $roless_data = $wpdb->get_results($sqlll);

    $roles = array();
    foreach ($roless_data as $key => $roless_da) {
        $roles[] = $roless_da->role;
    }


    if(in_array("2", $roles) || in_array("3", $roles) ){

        $user_listings = $wpdb->get_results("SELECT id,post_title,post_parent FROM $listing_posts_table as p WHERE `post_type`='listing' AND ( `post_author` = $author_id $inUserGroupsSQL ) AND NOT EXISTS (SELECT * FROM $listing_posts_table as p_r WHERE p.id = p_r.post_parent AND `post_type`='listing')  order by post_title ASC ");  
            
    }else{
        
        $user_listings = $wpdb->get_results("SELECT id,post_title,post_parent FROM $listing_posts_table as p WHERE `post_type`='listing' AND ( `post_author` = $author_id ) AND NOT EXISTS (SELECT * FROM $listing_posts_table as p_r WHERE p.id = p_r.post_parent AND `post_type`='listing')  order by post_title ASC "); 
        
    }
    
//$user_listings = $wpdb->get_results("SELECT id,post_title FROM $listing_posts_table WHERE (`post_author`=$author_id OR 'users_groups_id'='values from array') AND `post_type`='listing'");

                
//  echo "<pre>"; print_r($user_listings); die;

// spotrs_filter here 
foreach($spotrs_filter as $sportfilters){
    if(!empty($sportfilters->name)){
    $sportss_filter[] = array($sportfilters->name,$sportfilters->id ); 
    
    }
}
        wp_localize_script('custom-script','sportsList',array('sport'=> $sportss_filter, 'test' => $bc_schema_id));
        $ajax_data["sportsList"] = array('sport'=> $sportss_filter, 'test' => $bc_schema_id);


// filter location here 
foreach($filter_location as $filters){
    if(!empty($filters->name ) || $filters->name !== "Auto Draft" || !empty($filters->id)  ){
    $location_filter[] = array($filters->name,$filters->id); 
    
    }
}
        wp_localize_script('custom-script','filter_locations',array('filter_location'=> $location_filter));
        $ajax_data["filter_locations"] = array('filter_location'=> $location_filter);
    
    
// fetching filter sports ids     
    foreach($filter_sports_id as $sport_ids){
    if(!empty($sport_ids->gym_section_id ) || $sport_ids->sport_id  ){
    $sports_id_filter[] = array('id'=>$sport_ids->gym_section_id,'sport_id'=>$sport_ids->sport_id); 
    
    }
}
        wp_localize_script('custom-script','filter_sports_id',array('filter_sports_id'=> $sports_id_filter)); 
        $ajax_data["filter_sports_id"] = array('filter_sports_id'=> $sports_id_filter);   
    
    
    
    
    
    
    
/***************************************************************
*   geting wokring hours here  */

// foreach($gym_section_table as $hours){
//     if(!empty($hours->name)){
//     $allhours[] = array($hours->working_hours); 
    
//     }
    
//     } 
    wp_localize_script('custom-script','hourss',array('gym_section_table'=> $working_hours));
    $ajax_data["hourss"] = array('gym_section_table'=> $working_hours); 

$cuser_id=0;
if(is_user_logged_in()==true){
    $cuser_id = get_current_user_id();
    wp_localize_script('custom-script','is_user_login',true);
    $ajax_data["is_user_login"] = true;
}else{
    wp_localize_script('custom-script','is_user_login',false);
    $ajax_data["is_user_login"] = false;
    //Temp for development
    $cuser_id=1;
}
/***************************************************************
*Loading Gyms for current user depending on its muncipality_id*/
//Required things 1)nicipality_id in the ptn_users table 2)gym and gym_section table
//1) Getting Muncipality Id of Current User
$gym_resources =[];
$gym_sections_resources=[];
if($cuser_id !=0){
//|| No longer need to load the Gym Sections as the Resources||//
    $group_ids = get_current_user_id_custom(get_current_user_id());
    
    // $municipality_id = $wpdb->get_var("SELECT municipality_id FROM $users_table WHERE `ID`=$cuser_id"); 
    $group_ids = implode(",", $group_ids);

    $gyms            = $wpdb->get_results("SELECT * from $gym_table WHERE `users_groups_id` in ($group_ids)");
            // echo "<pre>"; print_r($gyms); die;
    $gyms_sections   = $wpdb->get_results("SELECT * from $gym_section_table");
    
    
    
    foreach($gyms as $gym){
        $color="orange";
        $gym_resources[]=array('text'    => $gym->name,
                                'value'   => $gym->id,
                                'id'   => $gym->id,
                                'color'   => $color,
                                );
    }
    foreach($gyms_sections as $gym_section){
        foreach($gyms as $gym){
        if($gym_section->gym_id == $gym->id){
            $gym_sections_resources[]=array(
                                    'text' => $gym_section->name,
                                    'value' => $gym_section->id,
                                    'gym_id' => $gym_section->gym_id,
                                    
                                    );
                }
        }
        
    }
    //gym section loop
    
    $user_listing_resources = [];
    foreach($user_listings as $listing){


        
        global $wpdb;
        $post_meta_table = $wpdb->prefix . "postmeta";
        $week_days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        $working_hours_arr1 = 
            [
                'monday'=>[
                    'start'=> null,
                    'end' => null,
                    'startBreak'=> null,
                    'endBreak'=>null,
                ],
                'tuesday'=>[
                        'start'=> null,
                        'end' => null,
                        'startBreak'=> null,
                        'endBreak'=>null,
                    ],
                'wednesday'=>[
                        'start'=> null,
                        'end' => null,
                        'startBreak'=> null,
                        'endBreak'=>null,
                    ],
                'thursday'=>[
                        'start'=> null,
                        'end' => null,
                        'startBreak'=> null,
                        'endBreak'=>null,
                    ],
                'friday'=>[
                        'start'=> null,
                        'end' => null,
                        'startBreak'=> null,
                        'endBreak'=>null,
                    ],
                'saturday'=>[
                        'start'=> null,
                        'end' => null,
                        'startBreak'=> null,
                        'endBreak'=>null,
                    ],
                'sunday'=>[
                        'start'=> null,
                        'end' => null,
                        'startBreak'=> null,
                        'endBreak'=>null,
                    ],
            ];

            $whr_slots = $wpdb->get_results("SELECT * FROM $post_meta_table WHERE post_id = $listing->id AND (meta_key = '_slots')"); 
            
        if(!empty($whr_slots)){

            foreach($whr_slots as $key_slot => $item_slots){
                $slotsss = json_decode($item_slots->meta_value);
                if(!empty($slotsss)){
                    if(isset($slotsss[0]) && !empty($slotsss[0])){

                        if(isset($slotsss[0][0])){
                            $explode_monday = explode("-", $slotsss[0][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['monday']['start'] = $start_hour;
                            $working_hours_arr1['monday']['end'] = $end_hour;
                        }
                    }
                }
                if(!empty($slotsss)){
                    if(isset($slotsss[1]) && !empty($slotsss[1])){

                        if(isset($slotsss[1][0])){
                            $explode_monday = explode("-", $slotsss[1][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['tuesday']['start'] = $start_hour;
                            $working_hours_arr1['tuesday']['end'] = $end_hour;
                        }
                    }
                }

                if(!empty($slotsss)){
                    if(isset($slotsss[2]) && !empty($slotsss[2])){

                        if(isset($slotsss[2][0])){
                            $explode_monday = explode("-", $slotsss[2][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['wednesday']['start'] = $start_hour;
                            $working_hours_arr1['wednesday']['end'] = $end_hour;
                        }
                    }
                }

                if(!empty($slotsss)){
                    if(isset($slotsss[3]) && !empty($slotsss[3])){

                        if(isset($slotsss[3][0])){
                            $explode_monday = explode("-", $slotsss[3][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['thursday']['start'] = $start_hour;
                            $working_hours_arr1['thursday']['end'] = $end_hour;
                        }
                    }
                }

                if(!empty($slotsss)){
                    if(isset($slotsss[4]) && !empty($slotsss[4])){

                        if(isset($slotsss[4][0])){
                            $explode_monday = explode("-", $slotsss[4][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['friday']['start'] = $start_hour;
                            $working_hours_arr1['friday']['end'] = $end_hour;
                        }
                    }
                }

                if(!empty($slotsss)){
                    if(isset($slotsss[5]) && !empty($slotsss[5])){

                        if(isset($slotsss[5][0])){
                            $explode_monday = explode("-", $slotsss[5][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['saturday']['start'] = $start_hour;
                            $working_hours_arr1['saturday']['end'] = $end_hour;
                        }
                    }
                }

                if(!empty($slotsss)){
                    if(isset($slotsss[6]) && !empty($slotsss[6])){

                        if(isset($slotsss[6][0])){
                            $explode_monday = explode("-", $slotsss[6][0]);
                            $start_hour = "";
                            $end_hour = "";
                            if(isset($explode_monday[0])){
                                $start_hour = trim(str_replace(" ", "", $explode_monday[0]));
                            }
                            if(isset($explode_monday[1])){
                                $end_hoursss = explode("|", $explode_monday[1]);

                                $end_hour = trim(str_replace(" ", "", $end_hoursss[0]));
                            }
                            $working_hours_arr1['sunday']['start'] = $start_hour;
                            $working_hours_arr1['sunday']['end'] = $end_hour;
                        }
                    }
                }

                
            }
            $hourss = $working_hours_arr1;
            
            
        }else{
            $hourss = $working_hours_arr1; 
        }
        $listing_sports_data = get_post_meta($listing->id, '_listing_sports');
        $sports = array();
        if(!empty($listing_sports_data)){
                

            

            foreach ($listing_sports_data as $key => $sp) {

                $sport_table = 'sport';
        
                $query = "SELECT id,name FROM $sport_table WHERE id = $sp";
                $sport_id_data = $wpdb->get_row($query);
                if(isset($sport_id_data->name)){
                        $sports[] = $sport_id_data->name;
                }

            }
            
            
        }
        if(!empty($sports)){
            sort($sports);
            $sports = "\t(".implode(", ", $sports).")";
        }else{
            $sports = "";
        }



        $post_title_full = $listing->post_title;
        $post_title = mb_strimwidth($listing->post_title, 0, 30, '...');
        if($post_title != '')
        $user_listing_resources[] = array(
                                    'name' => $post_title,
                                    'text' => $post_title,
                                    'full_text' => $post_title_full,
                                    'value'=> $listing->id,
                                    'id'=> $listing->id,
                                    'gym_id' => 2,
                                    'workingHours' => $hourss,
                                    'sports' => $sports,
        );

    }
    
}
//echo "<pre>user_listing_resources";print_r( $user_listing_resources);exit;
$listings_working_hours_raw = array();




//Making it Locally Available
wp_localize_script('custom-script','gym_resources',array('gyms'=>$gym_resources,'gym_sections'=>$gym_sections_resources,"listings"=> $user_listing_resources,'workingHours'=>$listings_working_hours_raw,'sample_data_next_id'=>$bc_schema_id));

$ajax_data["gym_resources"] = array('gyms'=>$gym_resources,'gym_sections'=>$gym_sections_resources,"listings"=> $user_listing_resources,'workingHours'=>$listings_working_hours_raw,'sample_data_next_id'=>$bc_schema_id);

$show_extra_info = get_user_meta(get_current_user_ID(),"show_extra_info",true);
wp_localize_script('custom-script','show_extra_info',$show_extra_info);
$ajax_data["show_extra_info"] = $show_extra_info;


//Loading Resources of Booking Calendar
$records=[];

foreach($booking_results as $record){

    $bookings_calendar_raw = $wpdb->prefix . 'bookings_calendar_raw';
    $bookings_calendar_raw_sql = "SELECT * from $bookings_calendar_raw where id =".$record->id;
    $bookings_calendar_raw_dd = $wpdb->get_row($bookings_calendar_raw_sql);

    if($record->application_id != ""){
        $sum_desired_hours = sum_desired_hours($record->application_id);
        $sum_received_hours = sum_received_hours($record->application_id);
        $sum_algo_hours = sum_algo_hours($record->application_id);
        $score = score($record->application_id);

        $app_data = array();
        $app_data["sum_desired_hours"] = $sum_desired_hours;
        $app_data["sum_received_hours"] = $sum_received_hours;
        $app_data["sum_algo_hours"] = $sum_algo_hours;
        $app_data["score"] = $score;

    }else{
        $sum_desired_hours = 0;
        $sum_received_hours = 0;
        $sum_algo_hours = 0;
        $score = "";
        $app_data = array();
        $app_data["sum_desired_hours"] = $sum_desired_hours;
        $app_data["sum_received_hours"] = $sum_received_hours;
        $app_data["sum_algo_hours"] = $sum_algo_hours;
        $app_data["score"] = $score;
    }

    


    if($bookings_calendar_raw_dd){

        $org_data = array();
        $org_start_d = date("H:i",strtotime($bookings_calendar_raw_dd->date_start)); 
        $org_end_d = date("H:i",strtotime($bookings_calendar_raw_dd->date_end));
        $org_data["name"] = get_the_title($bookings_calendar_raw_dd->listing_id);
        $org_data["day"] = date("l",strtotime($bookings_calendar_raw_dd->date_start));
        $org_data["time"] = $org_start_d." - ".$org_end_d;

    }else{
        $org_data = array();
        $org_data["name"] = "";
        $org_data["day"] = "";
        $org_data["time"] = "";

    }


    if($record->status == "pay_to_confirm"){
        continue;
    }
    $team_title =$club_name=$user_name= '';
    foreach($team_results as $team){
        if($team->club_id == $record->team_id){
            $team_title = $team->name;
        }            
    }
    foreach($club_results as $club){
        if($club->id == $record->bookings_author){
            $club_name = $club->company_name;
        }
    };

    foreach($user_results as $user){
        if($user->ID == $record->bookings_author){
            $user_name = $user->display_name;
        }
    };
    if($record->status == "paid" && $record->fixed == "1"){
        $record->status = "closed";
    }
    if($record->status == "paid" && $record->fixed == "2"){
        $record->status = "sesongbooking";
    }
    $org_status = $record->status;
    $status_text = "";
    if($current_language  == "nb-NO"){
        if($record->status == "paid" || $record->status == "Paid"){
            $status_text = "Betalt";
        }else if($record->status == "waiting" || $record->status == "Waiting"){
            $status_text = "Venter på godkjenning";
        }
        else if($record->status == "confirmed" || $record->status == "Confirmed"){
            $status_text = "Godkjenn";
        }
        else if($record->status == "pay_to_confirm"){
            $status_text = "Ikke gjennomført betaling";
        }
        else if($record->status == "expired" || $record->status == "Expired"){
            $status_text = "Utløpt booking";
        }
        else if($record->status == "canceled" || $record->status == "Canceled"){
            $status_text = "Kansellert";
        }
        else if($record->status == "closed" || $record->status == "Closed"){
            $status_text = "Stengt";
        }else if($record->status == "sesongbooking" || $record->status == "sesongbooking"){
            $status_text = "Sesongbooking";
        }
        else if($record->status == "unpaid" || $record->status == "Unpaid"){
            $status_text = "ubetalt";
        }
        else if($record->status == "Pending" || $record->status == "pending"){
            $status_text = "Avventer";
        }else{
            $status_text = $record->status;
        }
    }else{
        $status_text = $record->status;
    }
    $manuale_val = "0";

    if($cal_type == "view_only"){
        if($cal_view == "algoritme"){
            if($record->rejected == "1"){
                $record->status = "rejected";
            }else{
                $record->status = "algo_done"; 
            }
        }else{
            $record->status = "done"; 
        }

        if($cal_view == "manuelle"){

            if($record->rejected == "1" && $record->modified == "1"){
                $record->status = "rejected_modified";
            }elseif($record->rejected == "1" && $record->modified == "0"){
                $record->status = "rejected_notmodified";
            }elseif($record->rejected == "0" && $record->modified == "1"){
                $record->status = "notrejected_modified";
            }else{
                $record->status = "notrejected_notmodified";
            }
            if($record->rejected == "1"){
                $status_text = "Avslått";
            }else{
                $status_text = "Godkjent";
            }

        }

        $comment = $record->comment;




        
        
    }else{
        $comment = "";
    }

    $start_d = date("l H:i",strtotime($record->date_start)); 
    $end_d = date("l H:i",strtotime($record->date_end));
    if($current_language == "nb-NO"){
        $start_d = str_replace("Monday", "Mandag", $start_d);
        $start_d = str_replace("Tuesday", "Tirsdag", $start_d);
        $start_d = str_replace("Wednesday", "Onsdag", $start_d);
        $start_d = str_replace("Thursday", "Torsdag", $start_d);
        $start_d = str_replace("Friday", "Fredag", $start_d);
        $start_d = str_replace("Saturday", "Lørdag", $start_d);
        $start_d = str_replace("Sunday", "Søndag", $start_d);

        $end_d = str_replace("Monday", "Mandag", $end_d);
        $end_d = str_replace("Tuesday", "Tirsdag", $end_d);
        $end_d = str_replace("Wednesday", "Onsdag", $end_d);
        $end_d = str_replace("Thursday", "Torsdag", $end_d);
        $end_d = str_replace("Friday", "Fredag", $end_d);
        $end_d = str_replace("Saturday", "Lørdag", $end_d);
        $end_d = str_replace("Sunday", "Søndag", $end_d);

    }
    if($record->rejected == ""){
        $record->rejected = 0;
    }
    

    $extra_info = "";

    if($show_extra_info != "" && $show_extra_info != "0" && $record->application_id != ""){

        $applications_db = 'applications';  // table name
        $applications_sql = "SELECT * from $applications_db where id = ".$record->application_id;
        $applications_dd = $wpdb->get_row($applications_sql);

        

        if(isset($applications_dd->age_group_id) && $applications_dd->age_group_id != "" && $show_extra_info == "age_group"){
            $age_group_db = 'age_group';  // table name
            $age_group_sql = "SELECT name from $age_group_db where id =".$applications_dd->age_group_id;
            $age_group_dd = $wpdb->get_results($age_group_sql);
            
            $age_group_names = array();

            foreach ($age_group_dd as $key => $age_group_dd_val) {
                $age_group_names[] = $age_group_dd_val->name;
            }
            $extra_info = implode(", ", $age_group_names);
        }elseif(isset($applications_dd->team_level_id) && $applications_dd->team_level_id != "" && $show_extra_info == "level"){
            $team_level_db = 'team_level';  // table name
            $team_level_sql = "SELECT name from $team_level_db where id =".$applications_dd->team_level_id;
            $team_level_dd = $wpdb->get_results($team_level_sql);

            $team_level_names = array();

            foreach ($team_level_dd as $key => $team_level_dd_val) {
                $team_level_names[] = $team_level_dd_val->name;
            }
            $extra_info = implode(", ", $team_level_names);
        }elseif(isset($applications_dd->type_id) && $applications_dd->type_id != "" && $show_extra_info == "type"){
            $type_db = 'type';  // table name
            $type_sql = "SELECT name from $type_db where id =".$applications_dd->type_id;
            $type_dd = $wpdb->get_results($type_sql);

            $type_names = array();

            foreach ($type_dd as $key => $type_dd_val) {
                $type_names[] = $type_dd_val->name;
            }
            $extra_info = implode(", ", $type_names);
        }elseif(isset($applications_dd->sport_id) && $applications_dd->sport_id != "" && $show_extra_info == "sport"){
            $sport_db = 'sport';  // table name
            $sport_sql = "SELECT name from $sport_db where id =".$applications_dd->sport_id;
            $sport_dd = $wpdb->get_results($sport_sql);

            $sport_names = array();

            foreach ($sport_dd as $key => $sport_dd_val) {
                $sport_names[] = $sport_dd_val->name;
            }
            $extra_info = implode(", ", $sport_names);
        }elseif(isset($applications_dd->members) && $applications_dd->members != "" && $show_extra_info == "members"){
            
            $extra_info = $applications_dd->members;

        }elseif(isset($applications_dd->team_id) && $applications_dd->team_id != "" && $show_extra_info == "team_name"){
            $team_db = $wpdb->prefix . 'team';  // table name
            $team_sql = "SELECT name from $team_db where id =".$applications_dd->team_id;
            $team_dd = $wpdb->get_results($team_sql);

            $team_names = array();

            foreach ($team_dd as $key => $team_dd_val) {
                $team_names[] = $team_dd_val->name;
            }
            $extra_info = implode(", ", $team_names); 
        }
    }
    
    $record_data = array(
        
                'id'                  =>$record->id,
                'first_event_id'                  =>$record->first_event_id,
                'title'               =>$user_name,
                'description'         =>$record->description,
                'end'                 =>$record->date_end,
                'end_d'               =>$end_d,
                'start'               =>$record->date_start,
                'start_d'             =>$start_d,
                'endTimezone'         =>'',
                'image'               =>'',
                'isAllDay'            =>'',
                'rejected'            =>$record->rejected,
                'org_status'          =>$org_status,
                'comment'             =>  $comment,
                'extra_info'          =>  $extra_info,
                //'pricegroup'          =>['text'=>$record->price_group, 'value'=>$record->price_group],
                // 'recurrenceException' =>'',
                // 'recurrenceRule'      =>'',
                // 'startTimezone'       =>'',
                'status'              =>['text'=>$status_text,'value'=>$record->status],
                'status_manuale'      =>['text'=>$status_text,'value'=>$record->rejected],
                'team'                =>['text'=>is_null($record->team_id)? "Select":$team_title,'value'=>is_null($record->team_id)? "Select":$record->team_id],
                'client'              =>['text'=> $user_name, 'value'=>$record->bookings_author],
                'gymSectionId'        => $record->listing_id,
                'resource'        => $record->listing_id,
                'org_data'        => $org_data, 
                'app_data'        => $app_dataM
    );
    $record_data['recurrenceId']        = $record->recurrenceID;
    if($record->recurrenceRule != ''){  
        // $record_data['rrule']= str_replace('\\n','\n',$record->recurrenceRule);
        // $record_data['recurrenceRule']      = $record->recurrenceRule;
        $record_data['recurring'] = $record->recurrenceRule;
        if($record->recurrenceException != ''){
            $record_data['recurringException'] = $record->recurrenceException;
            $recurrenceException = "[";
            $exception = $record->recurrenceException;
            $exceptionArray = explode(",", $exception);
            foreach($exceptionArray as $except){
                if($recurrenceException == "["){
                    $recurrenceException .= '"' . substr($except, 0, 10) . '"';
                }else{
                    $recurrenceException .= ',"' . substr($except, 0, 10) . '"';
                }
            }
            $recurrenceException .= "]";
            $record_data['recurringException'] = $recurrenceException;
            // $record_data['recurringExceptionRule'] = $record->recurrenceRule;
        }
        // $record_data['recurringException'] = $record->recurrenceException;
        
        $datetime1 = new DateTime($record->date_start);
        $datetime2 = new DateTime($record->date_end);
        $interval = $datetime1->diff($datetime2);
        $record_data['duration'] = $interval->format('%H').":".$interval->format('%I');
    }
    $records[]=$record_data;
}


$ajax_data["schedular_tasks"] = $records;

if($get_ajax_data == 1){
    return $ajax_data;
}
wp_localize_script('custom-script','schedular_tasks',$records);
}

function sum_desired_hours($app_id){
    global $wpdb;
        $bookings_calendar_raw = $wpdb->prefix . 'bookings_calendar_raw';
        $sql = "select id,date_start,date_end from $bookings_calendar_raw WHERE `rejected` != 1 AND application_id=".$app_id;

        $bk_data = $wpdb->get_results($sql);

        

            $sum_desired_hours = "";
            foreach ($bk_data as $key => $bk_da) {
                if($bk_da->date_start != ""){
                    $date_start = $bk_da->date_start; 
                    $date_end = $bk_da->date_end; 
                    /*$hour_start = date("H:i",strtotime($bk_da->date_start));
                    $hour_end = date("H:i",strtotime($bk_da->date_end));*/
                    $datetime1 = new DateTime($date_start);
                    $datetime2 = new DateTime($date_end);

                    $interval = $datetime1->diff($datetime2);
                    if($interval->format('%h') < 10){
                        $hour = "0".$interval->format('%h');
                    }else{
                        $hour = (int) $interval->format('%h');
                    }
                    if($interval->format('%i') < 10){
                        $minute = "0".$interval->format('%i');
                    }else{
                        $minute = (int) $interval->format('%i');
                    }
                    $dattee = date("Y-m-d ".$hour.":".$minute.":00"); 

                    if($sum_desired_hours != ""){
                        $time_c = explode(":", $sum_desired_hours);  

                        $sum_desired_hours = date("H:i",strtotime('+'.$time_c[0].' hour +'.$time_c[1].' minutes',strtotime($dattee))); 
                    }else{

                        $sum_desired_hours = date("H:i",strtotime($dattee)); 
                    }
                }else{
                        $sum_desired_hours = "00:00";   
                }   


            }

            if($sum_desired_hours == "" || $sum_desired_hours == "00:00"){
                $sum_desired_hours = 0;
            }else{
                // echo $sum_desired_hours; die;
                $detec = explode(":", $sum_desired_hours);

                $dddd = array("01","02","03","04","05","06","07","08","09");
                if(in_array($detec[0], $dddd)){
                    $detec[0] = str_replace("0", "", $detec[0]);
                }

                $org_d = $detec[0].",".$detec[1]/60; 
                $sum_desired_hours = str_replace("0.","",$org_d);
                $sum_desired_hours = str_replace(",0","",$sum_desired_hours);
            }
        return $sum_desired_hours;    
}

function sum_received_hours($app_id){
            global $wpdb;

            $bookings_calendar_raw_approved_table =$wpdb->prefix .'bookings_calendar_raw_approved';

            $sql2 = "select id,date_start,date_end from $bookings_calendar_raw_approved_table WHERE `rejected` != 1 AND application_id=".$app_id;    


            $bk_data2 = $wpdb->get_results($sql2);

            


            $sum_received_hours = "";


            foreach ($bk_data2 as $key => $bk_da2) {

                if($bk_da2->date_start != ""){
                
                    $date_start = $bk_da2->date_start;
                    $date_end = $bk_da2->date_end; 
                    /*$hour_start = date("H:i",strtotime($bk_da->date_start));
                    $hour_end = date("H:i",strtotime($bk_da->date_end));*/
                    $datetime1 = new DateTime($date_start);
                    $datetime2 = new DateTime($date_end);
                    $interval = $datetime1->diff($datetime2);
                    if($interval->format('%h') < 10){
                        $hour = "0".$interval->format('%h');
                    }else{
                        $hour = (int) $interval->format('%h');
                    }
                    if($interval->format('%i') < 10){
                        $minute = "0".$interval->format('%i');
                    }else{
                        $minute = (int) $interval->format('%i');
                    }
                    $dattee = date("Y-m-d ".$hour.":".$minute.":00"); 

                    if($sum_received_hours != ""){
                        $time_c = explode(":", $sum_received_hours);  

                        $sum_received_hours = date("H:i",strtotime('+'.$time_c[0].' hour +'.$time_c[1].' minutes',strtotime($dattee))); 
                    }else{

                        $sum_received_hours = date("H:i",strtotime($dattee)); 
                    }
                }else{
                        $sum_received_hours = "00:00";   
                }    
            }
            if($sum_received_hours == "" || $sum_received_hours == "00:00"){
                $sum_received_hours = 0;
            }else{
                $detec = explode(":", $sum_received_hours);
                $dddd = array("01","02","03","04","05","06","07","08","09");
                if(in_array($detec[0], $dddd)){
                    $detec[0] = str_replace("0", "", $detec[0]);
                }

                $org_d = $detec[0].",".$detec[1]/60; 
                $sum_received_hours = str_replace("0.","",$org_d);
                $sum_received_hours = str_replace(",0","",$sum_received_hours);

            }

        return $sum_received_hours;    
}
function sum_algo_hours($app_id){
            global $wpdb;

            $bookings_calendar_raw_algorithm_table =$wpdb->prefix .'bookings_calendar_raw_algorithm';

            $sql3 = "select id,date_start,date_end from $bookings_calendar_raw_algorithm_table WHERE `rejected` != 1 AND application_id=".$app_id;

            $bk_data3 = $wpdb->get_results($sql3);


            $sum_algo_hours = "";


            foreach ($bk_data3 as $key => $bk_da3) {

                if($bk_da3->date_start != ""){
                
                    $date_start = $bk_da3->date_start;
                    $date_end = $bk_da3->date_end; 
                    /*$hour_start = date("H:i",strtotime($bk_da->date_start));
                    $hour_end = date("H:i",strtotime($bk_da->date_end));*/
                    $datetime1 = new DateTime($date_start);
                    $datetime2 = new DateTime($date_end);
                    $interval = $datetime1->diff($datetime2);
                    if($interval->format('%h') < 10){
                        $hour = "0".$interval->format('%h');
                    }else{
                        $hour = (int) $interval->format('%h');
                    }
                    if($interval->format('%i') < 10){
                        $minute = "0".$interval->format('%i');
                    }else{
                        $minute = (int) $interval->format('%i');
                    }
                    $dattee = date("Y-m-d ".$hour.":".$minute.":00"); 

                    if($sum_algo_hours != ""){
                        $time_c = explode(":", $sum_algo_hours);  

                        $sum_algo_hours = date("H:i",strtotime('+'.$time_c[0].' hour +'.$time_c[1].' minutes',strtotime($dattee))); 
                    }else{

                        $sum_algo_hours = date("H:i",strtotime($dattee)); 
                    }
                }else{
                        $sum_algo_hours = "00:00";   
                }    
            }
            if($sum_algo_hours == "" || $sum_algo_hours == "00:00"){
                $sum_algo_hours = 0;
            }else{
                $detec = explode(":", $sum_algo_hours);
                $dddd = array("01","02","03","04","05","06","07","08","09");
                if(in_array($detec[0], $dddd)){
                    $detec[0] = str_replace("0", "", $detec[0]);
                }

                $org_d = $detec[0].",".$detec[1]/60; 
                $sum_algo_hours = str_replace("0.","",$org_d);
                $sum_algo_hours = str_replace(",0","",$sum_algo_hours);
            }

        return $sum_algo_hours;    
}

function score($app_id){
            global $wpdb;

            $applications_table = 'applications';

            $sql3 = "select * from $applications_table WHERE id=".$app_id;

            $bk_data3 = $wpdb->get_row($sql3);

            if(isset($bk_data3->score)){
                $score = $bk_data3->score;
            }else{
                $score = "";
            }

        return $score;    
}

/*
* 
* UPDATED CODE
* 
*/



function wpm_user_shortcode(){
ob_start();

?>
<div class="col-md-12 wpm-content">
    <div id="example" class="k-content">
        <div id="users_table"></div>
    </div>
</div>
<span id="notification"></span>
<style type="text/css">
    .k-grid .k-grid-search {
        margin-left: auto;
        margin-right: 0;
    }
</style>
<?php
return ob_get_clean();
}

add_shortcode( 'users_shortcode', 'wpm_user_shortcode' );
function get_users_data(){
global $wpdb;
global $wp_roles;
if(isset($_REQUEST["update"]) && isset($_REQUEST["models"])){
    $models = json_decode(stripslashes($_POST["models"]));

    if(is_array($models)){
        //echo "<pre>"; print_r($models); die;
        foreach ($models as $key => $model) {

            /*echo "<pre>"; print_r($model); die;*/
            $user_id = (int) $model->ID; // correct ID
            $wpdb->update(
                $wpdb->users, 
                ['display_name' => $model->display_name], 
                ['ID' => $user_id]
            );

            $current_user = new WP_User( $user_id );

            
            foreach ($model->all_roles as $key => $all_role) {
                $current_user->remove_role( $all_role );
            }

            foreach ($model->user_roles as $key => $user_role) {
                $current_user->add_role( $user_role );
            }
            //echo "<pre>"; print_r($model); die;

            // Add role
            
        }

    }
}else{
    $roles = $wp_roles->roles; 

    $all_roles = array();



    foreach ($roles as $key => $value) {
        if($key != "administrator"){
            $all_roles[] = $key;
        }
        
    }

    $args = [
        'blog_id' => 1,
        'role__not_in' => ['administrator'],
        'orderby' => 'nicename',
        'order' => 'ASC',
        'fields' => 'all',
    ];
    $users = get_users($args);
    $options = array();
    foreach($users as $user){
        $user_meta = get_userdata($user->ID);
        $user_roles1 = $user_meta->roles;
        $user_roles = array();

        foreach ($user_roles1 as $key => $user_rol) {
            $user_roles[] = $user_rol;
        }
        $options[] = array('ID'=>(int) $user->ID , 'display_name'=>$user->display_name,'user_email'=>$user->user_email,"all_roles"=>$all_roles,"user_roles"=>$user_roles);   
    }
    // return "Hello There Still working";

    wp_send_json( $options );

}

exit();
}
add_action( 'wp_ajax_nopriv_get_users_data', 'get_users_data' );
add_action( 'wp_ajax_get_users_data', 'get_users_data' );

add_action( 'wp_ajax_nopriv_save_cal_setting', 'save_cal_setting' );
add_action( 'wp_ajax_save_cal_setting', 'save_cal_setting' );


add_action( 'wp_ajax_nopriv_save_cal_filter_group', 'save_cal_filter_group' );
add_action( 'wp_ajax_save_cal_filter_group', 'save_cal_filter_group' );

add_action( 'wp_ajax_nopriv_save_cal_filter_search', 'save_cal_filter_search' );
add_action( 'wp_ajax_save_cal_filter_search', 'save_cal_filter_search' );


function save_cal_filter_search(){
update_user_meta(get_current_user_ID(),"filter_search",$_POST["filter_search"]);
die;
}

add_action( 'wp_ajax_nopriv_save_cal_filters', 'save_cal_filters' );
add_action( 'wp_ajax_save_cal_filters', 'save_cal_filters' );


function save_cal_filter_group(){
update_user_meta(get_current_user_ID(),"filter_group",$_POST["filter_group"]);
die;
}

add_action( 'wp_ajax_nopriv_save_cal_filters', 'save_cal_filters' );
add_action( 'wp_ajax_save_cal_filters', 'save_cal_filters' );



function save_cal_filters(){
update_user_meta(get_current_user_ID(),"filter_location",$_POST["filter_location"]);
die;
}

add_action( 'wp_ajax_nopriv_save_cal_calview', 'save_cal_calview' );
add_action( 'wp_ajax_save_cal_calview', 'save_cal_calview' );

function save_cal_calview(){
update_user_meta(get_current_user_ID(),"calendar_view",$_POST["calendar_view"]);
die;
}

function save_cal_setting(){
update_user_meta(get_current_user_ID(),"cal_starttime",$_POST["starttime"]);
update_user_meta(get_current_user_ID(),"cal_endtime",$_POST["endtime"]);
update_option("show_full_day",$_POST["show_full_day"]);
update_user_meta(get_current_user_ID(),"cell_width",$_POST["cell_width"]);
update_user_meta(get_current_user_ID(),"show_extra_info",$_POST["show_extra_info"]);
die;
}

add_action( 'wp_ajax_nopriv_save_selected_season', 'save_selected_season' );
add_action( 'wp_ajax_save_selected_season', 'save_selected_season' );

function save_selected_season(){
update_user_meta(get_current_user_ID(),"selected_season",$_POST["season_id"]);
die;
}

add_action( 'wp_ajax_nopriv_save_cal_view', 'save_cal_view' );
add_action( 'wp_ajax_save_cal_view', 'save_cal_view' );

function save_cal_view(){
update_user_meta(get_current_user_ID(),"cal_view",$_POST["cal_view"]);
die;
}
add_action( 'wp_ajax_nopriv_not_rejected_showing', 'not_rejected_showing' );
add_action( 'wp_ajax_not_rejected_showing', 'not_rejected_showing' );

function not_rejected_showing(){
update_user_meta(get_current_user_ID(),"not_rejected_showing",$_POST["not_rejected_showing"]);
die;
}

add_action( 'wp_ajax_nopriv_export_csv', 'export_csv' );
add_action( 'wp_ajax_export_csv', 'export_csv' );

function export_csv(){ 
$jsonData = stripslashes(html_entity_decode($_POST["booking_data"]));



$jsonData=json_decode($jsonData,true);


    header('Content-Type: text/csv; charset=utf-8');  
    header('Content-Disposition: attachment; filename=export_booking.csv');  
    if(file_exists(plugin_dir_path(__FILE__).'csv/export_booking.csv')){
    unlink(plugin_dir_path(__FILE__).'csv/export_booking.csv');
    }
    $f = fopen(plugin_dir_path(__FILE__).'csv/export_booking.csv', 'a');
    fputcsv($f, array('Start date', 'End date', 'Comment', 'Client',"Listing","Team","status","Recurrence rule"));  
    global $wpdb;

    foreach ($jsonData as $key_v => $json_value) {
        $team_db = $wpdb->prefix . 'team';  // table name
        $team_id = $json_value["team"]["value"];
        $team_sql = "SELECT name from `$team_db` where id = '$team_id'";
        $team_data = $wpdb->get_row($team_sql);
        if($team_data){
            $team_name = $team_data->name;
        }else{
            $team_name = "";
        }
        $listing_db = $wpdb->prefix . 'posts';  // table name
        $listing_id = $json_value["sectionResourcesId"];
        $listing_sql = "SELECT post_title from `$listing_db` where ID = '$listing_id'";
        $listing_data = $wpdb->get_row($listing_sql);
        if($listing_data){
            $listing = $listing_data->post_title;
        }else{
            $listing = "";
        }
        fputcsv($f, array($json_value["start"], $json_value["end"], $json_value["description"], $json_value["client"]["text"],$listing,$team_name,$json_value["org_status"],$json_value["recurrenceRule"]));  
    }
    fclose($f);

    echo plugin_dir_url(__FILE__)."csv/export_booking.csv";

die;
}


add_action( 'wp_ajax_nopriv_move_approve_booking', 'move_approve_booking' );
add_action( 'wp_ajax_move_approve_booking', 'move_approve_booking' );

function move_approve_booking(){
global $wpdb;
$selected_season = $_POST["selected_season"];

$applications_sql = "SELECT id from applications where season_id = '$selected_season'";
$applications_data = $wpdb->get_results($applications_sql);
$app_ids = array();
foreach ($applications_data as  $applications_d) {
    $app_ids[] = $applications_d->id;
}
$app_ids = implode(",", $app_ids);

$bookings_calendar_raw_algorithm_db = $wpdb->prefix . 'bookings_calendar_raw_algorithm';  // table name
$bookings_calendar_raw_algorithm_sql = "SELECT * from `$bookings_calendar_raw_algorithm_db` where application_id in ($app_ids)";
$bookings_calendar_raw_algorithm_data = $wpdb->get_results($bookings_calendar_raw_algorithm_sql);


foreach ($bookings_calendar_raw_algorithm_data as $key => $value_approved) {

    $id = $value_approved->id;

    $bookings_calendar_raw_approved_db = $wpdb->prefix . 'bookings_calendar_raw_approved';  // table name
    $bookings_calendar_raw_approved_sql = "SELECT * from `$bookings_calendar_raw_approved_db` where id=$id";
    $bookings_calendar_raw_approved_data = $wpdb->get_results($bookings_calendar_raw_approved_sql);

    if(count($bookings_calendar_raw_approved_data) > 0){
        $wpdb->update($bookings_calendar_raw_approved_db, array(
            'team_id'                    => $value_approved->team_id,
            'repert'                    => $value_approved->repert,
            'application_id'                    => $value_approved->application_id,
            'date_start'                    => $value_approved->date_start,
            'date_end'                    => $value_approved->date_end,
            'first_event_id'                    => $value_approved->first_event_id,
            'rejected'                    => $value_approved->rejected,
            'modified'                    => $value_approved->modified,
            'description'                    => $value_approved->description,
            'title'                    => $value_approved->title,
            'gymsal'                    => $value_approved->gymsal,
            'styrkerom'                    => $value_approved->styrkerom,
            'published_at'                    => $value_approved->published_at,
            'created_by'                    => $value_approved->created_by,
            'updated_by'                    => $value_approved->updated_by,
            'created_at'                    => $value_approved->created_at,
            'updated_at'                    => $value_approved->updated_at,
            'fromweek'                    => $value_approved->fromweek,
            'toweek'                    => $value_approved->toweek,
            'bookings_author'                    => $value_approved->bookings_author,
            'owner_id'                    => $value_approved->owner_id,
            'listing_id'                    => $value_approved->listing_id,
            'comment'                    => $value_approved->comment,
            'order_id'                    => $value_approved->order_id,
            'status'                    => "paid",
            'fixed'                    => "2",
            'type'                    => $value_approved->type,
            'price'                    => $value_approved->price,
            'recurrenceRule'                    => $value_approved->recurrenceRule,
            'recurring'                    => $value_approved->recurrenceRule,
            'recurrenceID'                    => $value_approved->recurrenceID,
            'recurrenceException'                    => $value_approved->recurrenceException,
            ), array('id'=>$id)
        );
    }else{
        $wpdb->insert($bookings_calendar_raw_approved_db, array(
            'id'                    => $value_approved->id,
            'team_id'                    => $value_approved->team_id,
            'repert'                    => $value_approved->repert,
            'application_id'                    => $value_approved->application_id,
            'date_start'                    => $value_approved->date_start,
            'date_end'                    => $value_approved->date_end,
            'first_event_id'                    => $value_approved->first_event_id,
            'rejected'                    => $value_approved->rejected,
            'description'                    => $value_approved->description,
            'title'                    => $value_approved->title,
            'fixed'                    => $value_approved->fixed,
            'gymsal'                    => $value_approved->gymsal,
            'styrkerom'                    => $value_approved->styrkerom,
            'published_at'                    => $value_approved->published_at,
            'created_by'                    => $value_approved->created_by,
            'updated_by'                    => $value_approved->updated_by,
            'created_at'                    => $value_approved->created_at,
            'updated_at'                    => $value_approved->updated_at,
            'modified'                    => $value_approved->modified,
            'fromweek'                    => $value_approved->fromweek,
            'toweek'                    => $value_approved->toweek,
            'bookings_author'                    => $value_approved->bookings_author,
            'owner_id'                    => $value_approved->owner_id,
            'listing_id'                    => $value_approved->listing_id,
            'comment'                    => $value_approved->comment,
            'order_id'                    => $value_approved->order_id,
            'status'                    => "paid",
            'fixed'                    => "2",
            'type'                    => $value_approved->type,
            'price'                    => $value_approved->price,
            'recurrenceRule'                    => $value_approved->recurrenceRule,
            'recurring'                    => $value_approved->recurrenceRule,
            'recurrenceID'                    => $value_approved->recurrenceID,
            'recurrenceException'                    => $value_approved->recurrenceException,
            )
        );
    }    

    //$wpdb->delete($bookings_calendar_raw_algorithm_db,array("id"=>$id));
        
}
die;
}



function get_tranlation($language){

    $gibbs = [
        "week" => __("Week- ","Gibbs"),
        "Location" => __("Location","Gibbs"),
        "Sports" => __("Sports","Gibbs"),
        "USE" => __("USE","Gibbs"),
        "Club/Client" => __("Club/Client","Gibbs"),
        "No teams found for selected user" => __("No teams found for selected user","Gibbs"),
        "No Reservation Found!" => __("No Reservation Found!","Gibbs"),
        "Username" => __("Username","Gibbs"),
        "FirstName" => __("FirstName","Gibbs"),
        "LastName" => __("LastName","Gibbs"),
        "Description" => __("Description","Gibbs"),
        "Email" => __("Email","Gibbs"),
        "Phone" => __("Phone","Gibbs"),
        "Filter" => __("Filter","Gibbs"),
        "Select Location" => __("Select Location","Gibbs"),
        "Setting" => __("Settings","Gibbs"),
        "Calendar Setting" => __("Calendar Setting","Gibbs"),
        "View calendar from" => __("Vis kalender fra ","Gibbs"),
        "View calendar to" => __("Vis kalender til ","Gibbs"),
        "View calendar from 00:00 - 23:59" => __("Vis kalender fra 00:00-23:59 ","Gibbs"),
        "Start" => __("Start","Gibbs"),
        "Select" => __("Select","Gibbs"),
        "End" => __("End","Gibbs"),
        "Show full day" => __("Show full day","Gibbs"),
        "Export to PDF" => __("Export to PDF","Gibbs"),
        "Search" => __("Search","Gibbs"),
        "Client" => __("Client","Gibbs"),
        "Team" => __("Team","Gibbs"),
        "Comment" => __("Comment","Gibbs"),
        "Repeat" => __("Repeat","Gibbs"),
        "Related booking" => __("Related booking","Gibbs"),
        "Message" => __("Message","Gibbs"),
        "Booking details" => __("Booking details","Gibbs"),
        "Customer info" => __("Customer info","Gibbs"),
        "Client Name" => __("Client Name","Gibbs"),
        "Date" => __("Date","Gibbs"),
        "Time" => __("Time","Gibbs"),
        "ALL RESERVATION" => __("ALL RESERVATION","Gibbs"),
        "CLIENT INFO" => __("CLIENT INFO","Gibbs"),
        "Client Name" => __("Client Name","Gibbs"),
        "Date" => __("Date","Gibbs"),
        "Time" => __("Time","Gibbs"),
        "Select Group" => __("Select Group","Select Group"),            
        "Listing" => __("Listing","Gibbs"),
        "Status" => __("Status","Gibbs"),
        "Action" => __("Action","Gibbs"),
        "No Data" => __("No Data","Gibbs"),
        "No Data Found in Team" => __("No Data Found in Team","Gibbs"),
        "loading" => __("Loading","Gibbs"),
        "No Title" => __("No Title","Gibbs"),
        "Fra" => __("Fra","Gibbs"),
        "Till" => __("Till","Gibbs"),
        "Group" => __("Group","Group"),
        "Teams" => __("Teams","Gibbs"),
        "export_in_csv" => __("Eksporter til csv","Gibbs"),
        "export_in_database" => __("Til admin kalender","Gibbs"),
        "select_export_option" => __("Eksporter","Gibbs"),
        "Velg" => __("Velg","Gibbs"),
        "cell_width" => __("Cellebredde ","Gibbs"),
        "timeline_cell_width" => __("Timeline Cell width","Gibbs"),
        "timeline_week_cell_width" => __("Timeline week Cell width","Gibbs"),
        "small" => __("Liten","Gibbs"),
        "medium" => __("Medium","Gibbs"),
        "big" => __("Stor","Gibbs"),
        "show_extra_info" => __("Nøkkelinfo ","Gibbs"),
        "age_group" => __("Age group","Gibbs"),
        "level" => __("Level","Gibbs"),
        "type" => __("Type","Gibbs"),
        "sport" => __("Sport","Gibbs"),
        "members" => __("Members","Gibbs"),
        "team_name" => __("Team name","Gibbs"),
    ];

wp_localize_script('custom-script','tranlations',$gibbs);

return $gibbs;

}
add_action( 'wp_ajax_nopriv_get_booking_data', 'get_booking_data' );
add_action( 'wp_ajax_get_booking_data', 'get_booking_data' );

function get_booking_data(){

$post_data = array("cal_type"=>$_POST["cal_type"],"cal_view"=>$_POST["cal_view"]);

$data = scheduler_tasks_to_js($post_data);

wp_send_json( $data );
die;
    
}